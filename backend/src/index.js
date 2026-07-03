const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Garantir que a pasta de uploads existe
const UPLOADS_DIR = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Configurações do CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
}));

app.use(express.json());
app.use(cookieParser());

// Configurações de Cabeçalhos de Segurança HTTP
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Content-Security-Policy', "default-src 'self'; frame-ancestors 'none';");
  next();
});

// Resolução segura de chave JWT
function getJwtSecret() {
  if (process.env.JWT_SECRET && process.env.JWT_SECRET !== 'gerar_uma_hash_segura_de_32_bytes_ou_mais') {
    return process.env.JWT_SECRET;
  }
  // Fallback seguro em memória para evitar falhas silenciosas
  console.warn("WARNING: Utilizando segredo JWT temporário gerado em tempo de execução.");
  return crypto.randomBytes(32).toString('hex');
}
const JWT_SECRET = getJwtSecret();

// ----------------------------------------------------
// Middleware de Autenticação (JWT em Cookie HttpOnly)
// ----------------------------------------------------
const authenticate = async (req, res, next) => {
  const token = req.cookies['session_token'];
  if (!token) {
    return res.status(401).json({ error: 'Não autenticado.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Sessão inválida ou expirada.' });
  }
};

// ----------------------------------------------------
// Proteção CSRF (Double Submit Cookie)
// ----------------------------------------------------
// Rota para obter o token CSRF inicial
app.get('/api/csrf-token', (req, res) => {
  const csrfToken = crypto.randomBytes(24).toString('hex');
  
  // Define o token no cookie (acessível pelo JS frontend)
  res.cookie('csrf_token', csrfToken, {
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });
  
  return res.json({ csrfToken });
});

// Middleware de validação CSRF para requisições de alteração de estado
const validateCsrf = (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const cookieToken = req.cookies['csrf_token'];
  const headerToken = req.headers['x-csrf-token'];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({ error: 'Validação CSRF falhou.' });
  }

  next();
};

app.use(validateCsrf);

// ----------------------------------------------------
// Gerenciamento e Upload de Fotos Seguro
// ----------------------------------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    // Renomeia o arquivo para um UUID único mantendo uma extensão segura
    const uniqueSuffix = crypto.randomUUID();
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
    
    if (allowedExtensions.includes(ext) && allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido. Apenas imagens (PNG, JPG, GIF) são aceitas.'));
    }
  }
});

// Rota de Upload
app.post('/api/upload', authenticate, (req, res) => {
  upload.single('photo')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }
    // Retorna o nome seguro do arquivo salvo
    res.json({ filename: req.file.filename });
  });
});

// Servir fotos dos objetos de forma segura (Prevenção de Path Traversal)
app.get('/api/uploads/:filename', (req, res) => {
  try {
    const filename = path.basename(req.params.filename);
    const filePath = path.join(UPLOADS_DIR, filename);

    // Garante que o arquivo acessado está dentro do limite do diretório de uploads
    if (!filePath.startsWith(UPLOADS_DIR + path.sep)) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Arquivo não encontrado.' });
    }

    // Define os headers de segurança apropriados
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Define o content type apropriado baseando-se na extensão
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif'
    };
    res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');

    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao processar o arquivo.' });
  }
});

// ----------------------------------------------------
// Rotas de Autenticação
// ----------------------------------------------------

// Registrar Usuário
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Preencha todos os campos.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'A senha deve possuir pelo menos 8 caracteres.' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'E-mail já cadastrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    });

    res.status(201).json({ id: user.id, email: user.email, name: user.name });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno ao criar usuário.' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Preencha todos os campos.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    // Salva o JWT em um cookie HttpOnly seguro
    res.cookie('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
    });

    res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('session_token');
  res.json({ message: 'Desconectado com sucesso.' });
});

// Obter usuário logado
app.get('/api/auth/me', authenticate, (req, res) => {
  res.json({ id: req.user.id, email: req.user.email, name: req.user.name, role: req.user.role });
});

// ----------------------------------------------------
// Rotas da Aplicação (Achados e Perdidos)
// ----------------------------------------------------

// Listar Objetos (Com filtros de busca)
app.get('/api/items', async (req, res) => {
  const { search, category, status } = req.query;

  try {
    const where = {};

    if (category) {
      where.category = category.toString();
    }

    if (status) {
      where.status = status.toString();
    }

    if (search) {
      where.OR = [
        { title: { contains: search.toString(), mode: 'insensitive' } },
        { description: { contains: search.toString(), mode: 'insensitive' } },
        { location: { contains: search.toString(), mode: 'insensitive' } }
      ];
    }

    const items = await prisma.item.findMany({
      where,
      include: {
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar objetos.' });
  }
});

// Publicar Novo Objeto
app.post('/api/items', authenticate, async (req, res) => {
  const { title, description, photoUrl, category, location, occurrenceDate, status } = req.body;

  if (!title || !description || !category || !location || !occurrenceDate) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
  }

  try {
    const parsedDate = new Date(occurrenceDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: 'Data inválida.' });
    }

    const item = await prisma.item.create({
      data: {
        title,
        description,
        photoUrl,
        category,
        location,
        occurrenceDate: parsedDate,
        status: status || 'LOST',
        userId: req.user.id
      }
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar objeto.' });
  }
});

// Atualizar Status do Objeto
app.patch('/api/items/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['LOST', 'FOUND', 'RESOLVED'].includes(status)) {
    return res.status(400).json({ error: 'Status inválido.' });
  }

  try {
    const item = await prisma.item.findUnique({ where: { id } });

    if (!item) {
      return res.status(404).json({ error: 'Objeto não encontrado.' });
    }

    // Permite que o criador do anúncio ou um administrador altere o status
    if (item.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Não autorizado a alterar este objeto.' });
    }

    const updatedItem = await prisma.item.update({
      where: { id },
      data: { status }
    });

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar objeto.' });
  }
});

// Rota de Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Execução local
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '127.0.0.1', () => {
    console.log(`Backend escutando em http://127.0.0.1:${PORT}`);
  });
}

module.exports = app;

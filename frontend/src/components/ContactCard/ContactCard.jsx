import React from 'react';
import Input from '../Input/Input';
import './ContactCard.css';

function ContactCard({
  formData,
  onChange,
  onCheckboxChange,
  title = 'Informações de Contato'
}) {
  return (
    <aside
      className="contact-card"
      aria-labelledby="contact-card-title"
    >
      <header className="contact-card-header">
        <h2
          id="contact-card-title"
          className="contact-card-title"
        >
          {title}
        </h2>
      </header>

      <Input
        id="contactName"
        label="Responsável"
        placeholder="Nome do responsável"
        value={formData.contactName || ''}
        onChange={onChange}
        autoComplete="name"
      />

      <Input
        id="contactEmail"
        type="email"
        label="E-mail"
        placeholder="exemplo@email.com"
        value={formData.contactEmail || ''}
        onChange={onChange}
        autoComplete="email"
      />

      <Input
        id="contactPhone"
        type="tel"
        label="Telefone (opcional)"
        placeholder="(00) 00000-0000"
        value={formData.contactPhone || ''}
        onChange={onChange}
        autoComplete="tel"
      />

      <div className="contact-checkbox-group">
        <input
          id="allowContact"
          name="allowContact"
          type="checkbox"
          checked={formData.allowContact || false}
          onChange={onCheckboxChange}
          className="contact-checkbox"
        />

        <label
          htmlFor="allowContact"
          className="contact-checkbox-label"
        >
          Permitir que outras pessoas entrem em contato comigo.
        </label>
      </div>
    </aside>
  );
}

export default ContactCard;
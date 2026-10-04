import { useState, useEffect } from 'react';
import { TYPES, URGENCIES, BLOOD_GROUPS } from '../../constants';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useToast } from '../ui/Toast';

export default function NeedForm({ initialData, onSubmit, onClose, submitting = false }) {
  const toast = useToast();
  const [form, setForm] = useState({
    type: '',
    title: '',
    description: '',
    quantity: '',
    unit: '',
    urgency: 'NORMALE',
    estimatedPrice: '',
    bloodGroup: '',
  });
  const [errors, setErrors] = useState({});
  const [showBloodGroup, setShowBloodGroup] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        type: initialData.type || '',
        title: initialData.title || '',
        description: initialData.description || '',
        quantity: initialData.quantity || '',
        unit: initialData.unit || '',
        urgency: initialData.urgency || 'NORMALE',
        estimatedPrice: initialData.estimatedPrice || '',
        bloodGroup: initialData.bloodGroup || '',
      });
      setShowBloodGroup(initialData.type === 'SANG');
    } else {
      setForm({
        type: '',
        title: '',
        description: '',
        quantity: '',
        unit: '',
        urgency: 'NORMALE',
        estimatedPrice: '',
        bloodGroup: '',
      });
      setShowBloodGroup(false);
    }
    setErrors({});
  }, [initialData]);

  useEffect(() => {
    setShowBloodGroup(form.type === 'SANG');
  }, [form.type]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.type) newErrors.type = 'Veuillez choisir un type';
    if (!form.title.trim()) newErrors.title = 'Le titre est obligatoire';
    if (!form.description.trim()) newErrors.description = 'La description est obligatoire';
    if (!form.quantity || Number(form.quantity) <= 0) newErrors.quantity = 'Quantité invalide';
    if (!form.unit.trim()) newErrors.unit = 'Unité obligatoire';
    if (!form.urgency) newErrors.urgency = 'Urgence obligatoire';
    if (form.estimatedPrice && Number(form.estimatedPrice) < 0) newErrors.estimatedPrice = 'Prix invalide';
    if (showBloodGroup && !form.bloodGroup) newErrors.bloodGroup = 'Groupe sanguin obligatoire';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      type: form.type,
      title: form.title.trim(),
      description: form.description.trim(),
      quantity: Number(form.quantity),
      unit: form.unit.trim(),
      urgency: form.urgency,
      estimatedPrice: form.estimatedPrice ? Number(form.estimatedPrice) : null,
      bloodGroup: showBloodGroup ? form.bloodGroup : null,
    };

    onSubmit(payload);
  };

  const typeOptions = TYPES.map((t) => ({ value: t.value, label: `${t.icon} ${t.label}` }));
  const urgencyOptions = URGENCIES.map((u) => ({ value: u, label: u }));
  const unitOptions = ['unité', 'pièce', 'boîte', 'poche', 'litre', 'kg', 'mètre', 'autre'].map((u) => ({ value: u, label: u }));
  const bloodGroupOptions = BLOOD_GROUPS.map((b) => ({ value: b, label: b }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Type de besoin *"
        error={errors.type}
        value={form.type}
        onChange={(e) => handleChange('type', e.target.value)}
        as="select"
        options={[{ value: '', label: 'Choisir un type' }, ...typeOptions]}
      />

      <Input
        label="Titre *"
        error={errors.title}
        value={form.title}
        onChange={(e) => handleChange('title', e.target.value)}
        placeholder="Ex: Scanner IRM, Sang O-, Insuline..."
      />

      <Input
        label="Description *"
        error={errors.description}
        value={form.description}
        onChange={(e) => handleChange('description', e.target.value)}
        as="textarea"
        rows={3}
        placeholder="Détails du besoin, contexte, urgence..."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Quantité *"
          error={errors.quantity}
          value={form.quantity}
          onChange={(e) => handleChange('quantity', e.target.value)}
          type="number"
          min="1"
          placeholder="Ex: 10"
        />
        <Select
          label="Unité *"
          error={errors.unit}
          value={form.unit}
          onChange={(e) => handleChange('unit', e.target.value)}
          options={[{ value: '', label: 'Unité' }, ...unitOptions]}
        />
        <Select
          label="Urgence *"
          error={errors.urgency}
          value={form.urgency}
          onChange={(e) => handleChange('urgency', e.target.value)}
          options={urgencyOptions}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Prix estimé (TND)"
          error={errors.estimatedPrice}
          value={form.estimatedPrice}
          onChange={(e) => handleChange('estimatedPrice', e.target.value)}
          type="number"
          min="0"
          step="0.01"
          placeholder="Ex: 1500000"
          helperText="Laisser vide si non connu"
        />
        {showBloodGroup && (
          <Select
            label="Groupe sanguin *"
            error={errors.bloodGroup}
            value={form.bloodGroup}
            onChange={(e) => handleChange('bloodGroup', e.target.value)}
            options={[{ value: '', label: 'Choisir' }, ...bloodGroupOptions]}
          />
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
          Annuler
        </Button>
        <Button type="submit" loading={submitting}>
          {initialData ? 'Enregistrer les modifications' : 'Créer le besoin'}
        </Button>
      </div>
    </form>
  );
}
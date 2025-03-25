import { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import { Product } from '../models/Product';

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (product: Product) => void;
  initialData?: Product | null;
}

export default function AddProductModal({ open, onClose, onSubmit, initialData }: AddProductModalProps) {
  const [product, setProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    quantity: 0,
  });

  // Initialiser les champs avec les données du produit à modifier
  useEffect(() => {
    if (initialData) {
      setProduct(initialData);
    } else {
      setProduct({ name: '', description: '', price: 0, quantity: 0 });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' ? Number(value) : value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(product as Product);
    onClose();
    // Réinitialiser le formulaire après soumission
    setProduct({ name: '', description: '', price: 0, quantity: 0 });
  };

  return (
    <Modal open={open} onClose={onClose}
    BackdropProps={{
      sx: { backdropFilter: 'blur(10px)' }, // Flou appliqué uniquement en arrière-plan
    }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          backgroundColor: 'white',
        }}
      >
        <Typography variant="h6" gutterBottom>
          {initialData ? 'Modifier un produit' : 'Ajouter un produit'}
        </Typography>
        <TextField
          fullWidth
          label="Nom"
          name="name"
          value={product.name}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={product.description}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Prix"
          name="price"
          type="number"
          value={product.price}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Quantité"
          name="quantity"
          type="number"
          value={product.quantity}
          onChange={handleChange}
          margin="normal"
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button onClick={onClose} sx={{ mr: 2 }}>
            Annuler
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            {initialData ? 'Enregistrer' : 'Ajouter'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
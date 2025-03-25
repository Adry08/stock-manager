import { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Grid, Box } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Product } from '../models/Product';

interface ProductCardGridProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export default function ProductCardGrid({ products, onEdit, onDelete }: ProductCardGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelectedProduct(selectedProduct === id ? null : id);
  };

  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              onClick={() => handleSelect(product._id)}
              sx={{
                position: 'relative',
                cursor: 'pointer',
                borderRadius: 2,
                boxShadow: selectedProduct === product._id ? 6 : 2,
                border: selectedProduct === product._id ? '2px solid #007bff' : '1px solid #ddd',
                transition: 'all 0.3s ease-in-out',
              }}
            >
              {selectedProduct === product._id && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    display: 'flex',
                    gap: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    padding: '4px',
                    borderRadius: '8px',
                  }}
                >
                  <IconButton size="small" onClick={() => onEdit(product)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => onDelete(product._id)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              )}

              <CardContent>
                <Typography variant="h6" gutterBottom>{product.name}</Typography>
                <Typography variant="body2" color="text.secondary">{product.description}</Typography>
                <Typography variant="subtitle1" fontWeight="bold" mt={1}>
                  {product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </Typography>
                <Typography variant="body2">Quantité : {product.quantity}</Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
}

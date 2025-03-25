import React, { useState, useEffect } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Grid,
  MenuItem,
  Fab,
  Skeleton,
  Autocomplete,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ProductCardGrid from "../components/ProductCardGrid";
import AddProductModal from "../components/AddProductModal";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { Product } from "../models/Product";

export default function StockPage(): React.JSX.Element {
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [sortField, setSortField] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showFab, setShowFab] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const sortedProducts = [...products].sort((a, b) => {
    if (a[sortField as keyof Product] < b[sortField as keyof Product])
      return sortOrder === "asc" ? -1 : 1;
    if (a[sortField as keyof Product] > b[sortField as keyof Product])
      return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const filteredProducts = sortedProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowFab(true);
      } else {
        setShowFab(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSaveProduct = async (product: Product) => {
    try {
      const url = editingProduct ? `/api/products` : "/api/products";
      const method = editingProduct ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingProduct ? { id: editingProduct._id, ...product } : product
        ),
      });
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du produit:", error);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteProductId(id);
    setIsConfirmationOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteProductId) {
      try {
        const response = await fetch("/api/products", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: deleteProductId }),
        });
        if (response.ok) {
          fetchProducts();
        }
      } catch (error) {
        console.error("Erreur lors de la suppression du produit:", error);
      } finally {
        setIsConfirmationOpen(false);
        setDeleteProductId(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmationOpen(false);
    setDeleteProductId(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingProduct(null);
    setIsModalOpen(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: { xs: 2, sm: 4 }, // Padding responsive
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            position: "relative", // Pour le positionnement mobile
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: "bold",
              color: "primary.main",
              fontSize: { xs: "1.5rem", sm: "2.125rem" }, // Taille responsive
            }}
          >
            Gestion de Stock
          </Typography>

          {/* Version desktop du bouton */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsModalOpen(true)}
            sx={{
              fontWeight: "bold",
              display: { xs: "none", sm: "block" },
            }}
          >
            Ajouter un produit
          </Button>
        </Box>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Autocomplete
              fullWidth
              freeSolo
              options={products.map((product) => product.name)}
              value={searchQuery}
              onChange={(event, newValue) => {
                setSearchQuery(newValue || "");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Rechercher un produit"
                  variant="outlined"
                  size="small"
                />
              )}
            />
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <TextField
              select
              fullWidth
              label="Trier par"
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              variant="outlined"
              size="small"
            >
              <MenuItem value="name">Nom</MenuItem>
              <MenuItem value="price">Prix</MenuItem>
              <MenuItem value="quantity">Quantité</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <TextField
              select
              fullWidth
              label="Ordre"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              variant="outlined"
              size="small"
            >
              <MenuItem value="asc">Ascendant</MenuItem>
              <MenuItem value="desc">Descendant</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: "background.paper",
          }}
        >
          {loading ? (
            <Grid container spacing={3}>
              {Array.from(new Array(8)).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={200}
                    sx={{ borderRadius: 2 }}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <ProductCardGrid
              products={filteredProducts}
              onEdit={handleEditProduct}
              onDelete={handleDeleteClick}
            />
          )}
        </Paper>

        <AddProductModal
          open={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSaveProduct}
          initialData={editingProduct}
        />

        <ConfirmationDialog
          open={isConfirmationOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Confirmer la suppression"
          message="Êtes-vous sûr de vouloir supprimer ce produit ?"
        />
      </Container>

      {/* Version mobile - Toujours visible */}
      {isMobile && (
        <Fab
          color="primary"
          sx={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 1300,
            transform: "scale(0.9)",
            "&:hover": { transform: "scale(1)" },
            transition: "transform 0.2s",
          }}
          onClick={() => setIsModalOpen(true)}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Version desktop - Apparaît au scroll */}
      {!isMobile && showFab && (
        <Fab
          color="primary"
          sx={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 1300,
          }}
          onClick={() => setIsModalOpen(true)}
        >
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
}

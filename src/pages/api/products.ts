import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/db';
import Product from '../../models/Product';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  switch (req.method) {
    case 'GET': // Lire les produits
      try {
        const products = await Product.find({});
        res.status(200).json(products);
      } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des produits' });
      }
      break;

    case 'POST': // Créer un produit
      try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
      } catch (error) {
        console.error('Erreur lors de la création du produit:', error);
        res.status(500).json({ message: 'Erreur lors de la création du produit' });
      }
      break;

    case 'PUT': // Modifier un produit
      try {
        const { id, ...updateData } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedProduct) {
          return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.status(200).json(updatedProduct);
      } catch (error) {
        console.error('Erreur lors de la modification du produit:', error);
        res.status(500).json({ message: 'Erreur lors de la modification du produit' });
      }
      break;

    case 'DELETE': // Supprimer un produit
      try {
        const { id } = req.body;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
          return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.status(200).json({ message: 'Produit supprimé avec succès' });
      } catch (error) {
        console.error('Erreur lors de la suppression du produit:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression du produit' });
      }
      break;

    default:
      res.status(405).json({ message: 'Méthode non autorisée' });
      break;
  }
}
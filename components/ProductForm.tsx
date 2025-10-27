

import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Product, NewProduct, Company, ProductType, InventarioItem, RecipeItem } from '../types';
import { api } from '../services/api';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';

interface ProductFormProps {
  product?: Product | null;
  onSave: (product: Product | NewProduct) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel }) => {
  const { data: inventoryItems } = useQuery<InventarioItem[]>({
    queryKey: ['inventory'],
    queryFn: api.getInventory,
  });

  const [formData, setFormData] = useState<Omit<Product, 'id' | 'cost'>>({
    name: '',
    description: '',
    price: 0,
    type: ProductType.Platillo,
    recipe: [],
    company: Company.ColonialPachuca,
  });

  const [recipeState, setRecipeState] = useState({
      selectedIngredient: '',
      quantity: 0,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Omit<Product, 'id'>, string>>>({});

  const calculatedCost = useMemo(() => {
    if (!inventoryItems) return 0;
    return formData.recipe.reduce((total, recipeItem) => {
        const inventoryItem = inventoryItems.find(i => i.id === recipeItem.ingredientId);
        return total + (inventoryItem ? (inventoryItem.costPerUnit || 0) * recipeItem.quantity : 0);
    }, 0);
  }, [formData.recipe, inventoryItems]);


  useEffect(() => {
    if (product) {
      const { cost, ...productData } = product;
      setFormData(productData);
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleRecipeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setRecipeState(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };
  
  const handleAddIngredient = () => {
    if (!recipeState.selectedIngredient || recipeState.quantity <= 0) {
        alert("Seleccione un ingrediente y una cantidad válida.");
        return;
    }
    const ingredient = inventoryItems?.find(i => String(i.id) === recipeState.selectedIngredient);
    if (!ingredient) return;

    // Check if ingredient already exists
    if(formData.recipe.some(item => item.ingredientId === ingredient.id)) {
        alert("Este ingrediente ya está en la receta.");
        return;
    }

    const newRecipeItem: RecipeItem = {
        ingredientId: ingredient.id,
        ingredientName: ingredient.producto || '',
        quantity: recipeState.quantity,
        unit: ingredient.unidad || '',
    };

    setFormData(prev => ({...prev, recipe: [...prev.recipe, newRecipeItem]}));
    setRecipeState({ selectedIngredient: '', quantity: 0 }); // Reset form
  };
  
  const handleRemoveIngredient = (ingredientId: number) => {
      setFormData(prev => ({
          ...prev,
          recipe: prev.recipe.filter(item => item.ingredientId !== ingredientId)
      }));
  }

  const validate = (): boolean => {
      const newErrors: Partial<Record<keyof Omit<Product, 'id'>, string>> = {};
      if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio.";
      if (formData.price <= 0) newErrors.price = "El precio debe ser mayor a cero.";
      if (!formData.type) newErrors.type = "El tipo es obligatorio.";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    const submissionData = { ...formData, cost: calculatedCost };

    if (product) {
      onSave({ ...submissionData, id: product.id });
    } else {
      onSave(submissionData as NewProduct);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <Input label="Nombre del Platillo" name="name" value={formData.name} onChange={handleChange} required />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
         <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={2} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
        </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
            <Input label="Precio de Venta" name="price" type="number" min="0" step="0.01" value={formData.price} onChange={handleChange} required />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
        </div>
        <div>
            <Select label="Tipo" name="type" value={formData.type} onChange={handleChange} required >
                {Object.values(ProductType).map(pt => <option key={pt} value={pt}>{pt}</option>)}
            </Select>
             {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
        </div>
      </div>
      <div>
        <Select label="Empresa" name="company" value={formData.company} onChange={handleChange} required>
            {Object.values(Company).map(c => <option key={c} value={c}>{c}</option>)}
        </Select>
      </div>

        {/* Recipe Builder */}
        <div className="space-y-4 pt-4 border-t dark:border-gray-700">
            <h4 className="text-lg font-medium">Receta</h4>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md space-y-2">
                {formData.recipe.length > 0 ? (
                    <ul className="divide-y dark:divide-gray-600">
                        {formData.recipe.map(item => (
                            <li key={item.ingredientId.toString()} className="py-2 flex justify-between items-center">
                                <span>{item.ingredientName} - <span className="font-semibold">{item.quantity} {item.unit}</span></span>
                                <Button type="button" variant="danger" size="sm" onClick={() => handleRemoveIngredient(item.ingredientId)}>Quitar</Button>
                            </li>
                        ))}
                    </ul>
                ) : <p className="text-sm text-gray-500">Aún no hay ingredientes en la receta.</p>}
                 <div className="pt-2 font-semibold text-right">
                    Costo de Receta: {calculatedCost.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                <div className="md:col-span-2">
                    <Select label="Agregar Ingrediente" name="selectedIngredient" value={recipeState.selectedIngredient} onChange={handleRecipeChange}>
                        <option value="">Seleccione un ingrediente...</option>
                        {inventoryItems?.map(i => <option key={i.id.toString()} value={i.id.toString()}>{i.producto} ({i.unidad})</option>)}
                    </Select>
                </div>
                 <div className="flex items-center space-x-2">
                    <Input label="Cantidad" name="quantity" type="number" min="0" step="any" value={recipeState.quantity} onChange={handleRecipeChange} />
                    <Button type="button" onClick={handleAddIngredient} className="self-end">+</Button>
                </div>
            </div>
        </div>


      <div className="flex justify-end space-x-2 pt-4 border-t dark:border-gray-700">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  );
};

export default ProductForm;

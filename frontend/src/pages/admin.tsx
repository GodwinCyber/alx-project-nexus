import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  GET_CATEGORIES,
  GET_SUB_CATEGORIES,
  CREATE_CATEGORY,
  CREATE_SUB_CATEGORY,
  CREATE_PRODUCT,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  UPDATE_SUB_CATEGORY,
  DELETE_SUB_CATEGORY,
} from "@/graphql/products";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { Plus, Package, Tag, Edit, Trash2, Save, X } from "lucide-react";

// Component for selecting sub-categories based on selected category
function ProductSubCategorySelect({
  categoryId,
  value,
  onChange,
}: {
  categoryId: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const { data: subCategoriesData } = useQuery(GET_SUB_CATEGORIES, {
    variables: { categoryId: parseInt(categoryId) },
    skip: !categoryId,
  });

  const subCategories =
    (subCategoriesData as any)?.allSubCategories?.edges || [];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <option value="">Select Sub-Category (Optional)</option>
      {subCategories.map((edge: any) => (
        <option key={edge.node.id} value={edge.node.id}>
          {edge.node.name}
        </option>
      ))}
    </select>
  );
}

export function AdminPage() {
  const { user } = useAuth();
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [editingCategory, setEditingCategory] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<{
    id: string;
    name: string;
    categoryId: string;
  } | null>(null);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    amountInStock: "",
    categoryId: "",
    subCategoryId: "",
  });

  // Queries
  const { data: categoriesData, refetch: refetchCategories } =
    useQuery(GET_CATEGORIES);
  const { data: subCategoriesData, refetch: refetchSubCategories } = useQuery(
    GET_SUB_CATEGORIES,
    {
      variables: {
        categoryId: selectedCategoryId
          ? parseInt(selectedCategoryId)
          : undefined,
      },
      skip: !selectedCategoryId,
    },
  );

  // Mutations
  const [createCategory, { loading: creatingCategory }] = useMutation(
    CREATE_CATEGORY,
    {
      onCompleted: (data: any) => {
        toast.success("Category created successfully!");
        setCategoryName("");
        refetchCategories();
      },
      onError: (error: any) => {
        console.error("Error creating category:", error);
        toast.error("Failed to create category");
      },
    },
  );

  const [createSubCategory, { loading: creatingSubCategory }] = useMutation(
    CREATE_SUB_CATEGORY,
    {
      onCompleted: (data: any) => {
        toast.success("Sub-category created successfully!");
        setSubCategoryName("");
        refetchSubCategories();
      },
      onError: (error: any) => {
        console.error("Error creating sub-category:", error);
        toast.error("Failed to create sub-category");
      },
    },
  );

  const [createProduct, { loading: creatingProduct }] = useMutation(
    CREATE_PRODUCT,
    {
      onCompleted: (data: any) => {
        toast.success("Product created successfully!");
        setProductData({
          name: "",
          description: "",
          price: "",
          amountInStock: "",
          categoryId: "",
          subCategoryId: "",
        });
      },
      onError: (error: any) => {
        console.error("Error creating product:", error);
        toast.error("Failed to create product");
      },
    },
  );

  const [updateCategory] = useMutation(UPDATE_CATEGORY, {
    onCompleted: () => {
      toast.success("Category updated successfully!");
      setEditingCategory(null);
      refetchCategories();
    },
    onError: (error) => {
      console.error("Error updating category:", error.message);
      toast.error("Failed to update category");
    },
  });

  const [deleteCategory] = useMutation(DELETE_CATEGORY, {
    onCompleted: (data: any) => {
      toast.success("Category deleted successfully!");
      refetchCategories();
    },
    onError: (error: any) => {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    },
  });

  const [updateSubCategory] = useMutation(UPDATE_SUB_CATEGORY, {
    onCompleted: (data: any) => {
      if (data.updateSubCategory.ok) {
        toast.success("Sub-category updated successfully!");
        setEditingSubCategory(null);
        refetchSubCategories();
      }
    },
    onError: (error: any) => {
      console.error("Error updating sub-category:", error);
      toast.error("Failed to update sub-category");
    },
  });

  const [deleteSubCategory] = useMutation(DELETE_SUB_CATEGORY, {
    onCompleted: (data: any) => {
      if (data.deleteSubCategory.ok) {
        toast.success("Sub-category deleted successfully!");
        refetchSubCategories();
      }
    },
    onError: (error: any) => {
      console.error("Error deleting sub-category:", error);
      toast.error("Failed to delete sub-category");
    },
  });

  if (!user) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold mb-2">Please Login</h2>
        <p className="text-muted-foreground">
          You need to be logged in to access the admin panel.
        </p>
      </div>
    );
  }

  const categories = (categoriesData as any)?.allCategories?.edges || [];
  const subCategories =
    (subCategoriesData as any)?.allSubCategories?.edges || [];

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    await createCategory({
      variables: {
        input: { name: categoryName.trim() },
      },
    });
  };

  const handleCreateSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subCategoryName.trim() || !selectedCategoryId) {
      toast.error("Please enter a sub-category name and select a category");
      return;
    }

    await createSubCategory({
      variables: {
        input: {
          name: subCategoryName.trim(),
          categoryId: parseInt(selectedCategoryId),
        },
      },
    });
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !productData.name.trim() ||
      !productData.price ||
      !productData.categoryId
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    await createProduct({
      variables: {
        input: {
          name: productData.name.trim(),
          description: productData.description.trim(),
          price: parseFloat(productData.price),
          amountInStock: parseInt(productData.amountInStock) || 0,
          categoryId: parseInt(productData.categoryId),
          subCategoryId: productData.subCategoryId
            ? parseInt(productData.subCategoryId)
            : null,
        },
      },
    });
  };

  const handleUpdateCategory = async (id: string, name: string) => {
    if (!name.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    await updateCategory({
      variables: {
        id: parseInt(id),
        input: { name: name.trim() },
      },
    });
  };

  const handleDeleteCategory = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this category? This will also delete all associated sub-categories and products.",
      )
    ) {
      await deleteCategory({
        variables: { id: parseInt(id) },
      });
    }
  };

  const handleUpdateSubCategory = async (
    id: string,
    name: string,
    categoryId: string,
  ) => {
    if (!name.trim()) {
      toast.error("Sub-category name cannot be empty");
      return;
    }

    await updateSubCategory({
      variables: {
        id: parseInt(id),
        input: {
          name: name.trim(),
          categoryId: parseInt(categoryId),
        },
      },
    });
  };

  const handleDeleteSubCategory = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this sub-category?")) {
      await deleteSubCategory({
        variables: { id: parseInt(id) },
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2">
        <Package className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Admin Panel</h1>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Tag className="h-5 w-5" />
              <span>Create Category</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <Input
                placeholder="Category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />
              <Button
                type="submit"
                className="w-full"
                disabled={creatingCategory}
              >
                <Plus className="mr-2 h-4 w-4" />
                {creatingCategory ? "Creating..." : "Create Category"}
              </Button>
            </form>

            {/* Display existing categories */}
            <div className="mt-4 space-y-2">
              <h4 className="font-medium">Existing Categories:</h4>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {categories.map((edge: any) => (
                  <div
                    key={edge.node.id}
                    className="text-sm p-2 bg-muted rounded flex items-center justify-between"
                  >
                    {editingCategory?.id === edge.node.id ? (
                      <div className="flex items-center space-x-2 flex-1">
                        <Input
                          value={editingCategory.name}
                          onChange={(e) =>
                            setEditingCategory({
                              ...editingCategory,
                              name: e.target.value,
                            })
                          }
                          className="h-8 text-sm"
                        />
                        <Button
                          size="sm"
                          onClick={() =>
                            handleUpdateCategory(
                              editingCategory.id,
                              editingCategory.name,
                            )
                          }
                        >
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingCategory(null)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span
                          className="flex-1 cursor-pointer hover:text-primary"
                          onClick={() => setSelectedCategoryId(edge.node.id)}
                        >
                          {edge.node.name}
                        </span>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              setEditingCategory({
                                id: edge.node.id,
                                name: edge.node.name,
                              })
                            }
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteCategory(edge.node.id)}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Create Sub-Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Tag className="h-5 w-5" />
              <span>Create Sub-Category</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateSubCategory} className="space-y-4">
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Select Category</option>
                {categories.map((edge: any) => (
                  <option key={edge.node.id} value={edge.node.id}>
                    {edge.node.name}
                  </option>
                ))}
              </select>
              <Input
                placeholder="Sub-category name"
                value={subCategoryName}
                onChange={(e) => setSubCategoryName(e.target.value)}
                required
              />
              <Button
                type="submit"
                className="w-full"
                disabled={creatingSubCategory}
              >
                <Plus className="mr-2 h-4 w-4" />
                {creatingSubCategory ? "Creating..." : "Create Sub-Category"}
              </Button>
            </form>

            {/* Display existing sub-categories */}
            {selectedCategoryId && (
              <div className="mt-4 space-y-2">
                <h4 className="font-medium">Sub-Categories:</h4>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {subCategories.map((edge: any) => (
                    <div
                      key={edge.node.id}
                      className="text-sm p-2 bg-muted rounded flex items-center justify-between"
                    >
                      {editingSubCategory?.id === edge.node.id ? (
                        <div className="flex items-center space-x-2 flex-1">
                          <Input
                            value={editingSubCategory.name}
                            onChange={(e) =>
                              setEditingSubCategory({
                                ...editingSubCategory,
                                name: e.target.value,
                              })
                            }
                            className="h-8 text-sm"
                          />
                          <Button
                            size="sm"
                            onClick={() =>
                              handleUpdateSubCategory(
                                editingSubCategory.id,
                                editingSubCategory.name,
                                editingSubCategory.categoryId,
                              )
                            }
                          >
                            <Save className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingSubCategory(null)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <span className="flex-1">{edge.node.name}</span>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                setEditingSubCategory({
                                  id: edge.node.id,
                                  name: edge.node.name,
                                  categoryId: edge.node.category.id,
                                })
                              }
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                handleDeleteSubCategory(edge.node.id)
                              }
                            >
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Product */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Create Product</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <Input
                placeholder="Product name"
                value={productData.name}
                onChange={(e) =>
                  setProductData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
              <textarea
                placeholder="Product description"
                value={productData.description}
                onChange={(e) =>
                  setProductData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Price"
                value={productData.price}
                onChange={(e) =>
                  setProductData((prev) => ({ ...prev, price: e.target.value }))
                }
                required
              />
              <Input
                type="number"
                placeholder="Stock quantity"
                value={productData.amountInStock}
                onChange={(e) =>
                  setProductData((prev) => ({
                    ...prev,
                    amountInStock: e.target.value,
                  }))
                }
                required
              />
              <select
                value={productData.categoryId}
                onChange={(e) =>
                  setProductData((prev) => ({
                    ...prev,
                    categoryId: e.target.value,
                    subCategoryId: "",
                  }))
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Select Category</option>
                {categories.map((edge: any) => (
                  <option key={edge.node.id} value={edge.node.id}>
                    {edge.node.name}
                  </option>
                ))}
              </select>
              {productData.categoryId && (
                <ProductSubCategorySelect
                  categoryId={productData.categoryId}
                  value={productData.subCategoryId}
                  onChange={(value) =>
                    setProductData((prev) => ({
                      ...prev,
                      subCategoryId: value,
                    }))
                  }
                />
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={creatingProduct}
              >
                <Plus className="mr-2 h-4 w-4" />
                {creatingProduct ? "Creating..." : "Create Product"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

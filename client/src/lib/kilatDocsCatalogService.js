// CK-DOC-03B-SAFE-V2
import { supabase } from "./supabase";
import {
  KILAT_DOCS_CATALOG,
  KILAT_DOCS_CATEGORIES,
} from "../data/kilatDocsCatalog";

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeFields(value) {
  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
}

function createLocalSnapshot(errorMessage = "") {
  return {
    source: "local",
    errorMessage,
    categories: KILAT_DOCS_CATEGORIES,
    documents: KILAT_DOCS_CATALOG,
  };
}

function mapCategory(row) {
  // CK-DOC-03B-FIX-CATEGORY-LABELS
  const localCategory =
    KILAT_DOCS_CATEGORIES.find(
      (category) =>
        category.id === row.id ||
        category.slug === row.slug ||
        category.name === row.name ||
        category.label === row.name,
    ) || {};

  const displayName =
    row.name ||
    localCategory.label ||
    localCategory.name ||
    localCategory.title ||
    row.id;

  const displayIcon =
    row.icon ||
    localCategory.icon ||
    localCategory.emoji ||
    localCategory.symbol ||
    "";

  return {
    ...localCategory,
    id: row.id,
    slug: row.slug || localCategory.slug || row.id,
    label: displayName,
    name: displayName,
    title: displayName,
    shortLabel:
      localCategory.shortLabel ||
      localCategory.shortName ||
      localCategory.badge ||
      displayName,
    shortName:
      localCategory.shortName ||
      localCategory.shortLabel ||
      localCategory.badge ||
      displayName,
    badge:
      localCategory.badge ||
      localCategory.shortLabel ||
      localCategory.shortName ||
      displayName,
    icon: displayIcon,
    emoji: displayIcon,
    description: row.description || localCategory.description || "",
    status: row.status || localCategory.status || "COMING_SOON",
    sortOrder: row.sort_order || localCategory.sortOrder || 0,
  };
}

function mapDocument(row, categoryById, subcategoryById) {
  const category = categoryById.get(row.category_id);
  const subcategory = subcategoryById.get(row.subcategory_id);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description || "",
    useCase: row.use_case || "",
    risk: row.risk || "",
    categoryId: row.category_id,
    categoryLabel: category?.label || category?.name || row.category_id,
    subcategoryId: row.subcategory_id || "",
    subcategoryLabel: subcategory?.name || "Umum",
    status: row.status || "COMING_SOON",
    outputFormat: normalizeArray(row.output_format),
    fields: normalizeFields(row.fields),
    tags: normalizeArray(row.tags),
    sortOrder: row.sort_order || 0,
    featured: Boolean(row.is_featured),
  };
}

export async function fetchKilatDocsCatalogWithFallback() {
  try {
    const [categoriesResult, subcategoriesResult, catalogResult] = await Promise.all([
      supabase
        .from("document_categories")
        .select("id, slug, name, description, icon, sort_order, status")
        .in("status", ["ACTIVE", "COMING_SOON"])
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true }),
      supabase
        .from("document_subcategories")
        .select("id, category_id, slug, name, description, sort_order, status")
        .in("status", ["ACTIVE", "COMING_SOON"])
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true }),
      supabase
        .from("document_catalog")
        .select("id, slug, category_id, subcategory_id, title, description, use_case, risk, status, output_format, fields, tags, sort_order, is_featured")
        .in("status", ["ACTIVE", "COMING_SOON"])
        .order("sort_order", { ascending: true })
        .order("title", { ascending: true }),
    ]);

    const error =
      categoriesResult.error ||
      subcategoriesResult.error ||
      catalogResult.error;

    if (error) {
      return createLocalSnapshot(error.message || "Gagal memuat katalog dari database.");
    }

    const categoryRows = normalizeArray(categoriesResult.data);
    const subcategoryRows = normalizeArray(subcategoriesResult.data);
    const catalogRows = normalizeArray(catalogResult.data);

    if (!categoryRows.length || !catalogRows.length) {
      return createLocalSnapshot("Database belum memiliki data katalog.");
    }

    const categories = categoryRows.map(mapCategory);
    const categoryById = new Map(categories.map((category) => [category.id, category]));
    const subcategoryById = new Map(subcategoryRows.map((subcategory) => [subcategory.id, subcategory]));

    const documents = catalogRows.map((document) =>
      mapDocument(document, categoryById, subcategoryById),
    );

    return {
      source: "database",
      errorMessage: "",
      categories,
      documents,
    };
  } catch (error) {
    return createLocalSnapshot(error?.message || "Gagal memuat katalog dari database.");
  }
}

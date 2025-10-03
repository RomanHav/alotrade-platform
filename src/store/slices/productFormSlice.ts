import { createSlice, PayloadAction, Draft } from '@reduxjs/toolkit';
import { arrayMove } from '@dnd-kit/sortable';

export type MediaItem = {
  id: string;
  url: string;
  alt?: string | null;
  publicId?: string | null;
};

export type VariantForm = {
  id?: string;
  label?: string;
  volumeMl?: number;
  position: number;
  imageId?: string | null;
  imageUrl?: string | null;
  imagePublicId?: string | null;
};

export type ProductFormState = {
  id?: string;
  name?: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVE';
  brandId?: string;
  description?: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  variants: VariantForm[];
  images: MediaItem[];
  coverId: string | null;
  coverFallbackUrl: string | null; // если coverId не найден в images — показываем это
};

const initialState: ProductFormState = {
  status: 'DRAFT',
  variants: [{ position: 0 }, { position: 1 }, { position: 2 }],
  images: [],
  coverId: null,
  coverFallbackUrl: null,
};

function ensureCover(state: Draft<ProductFormState>) {
  if (state.images.length === 0) {
    state.coverId = null;
    return;
  }
  const idx = state.images.findIndex((m) => m.id === state.coverId);
  if (idx === -1) {
    state.coverId = state.images[0].id;
  }
}

function parseVolumeToMl(label: string): number | undefined {
  const raw = label.replace(',', '.').toLowerCase().trim();

  const mLfromL = raw.match(/^([0-9]+(\.[0-9]+)?)\s*л$/i);
  if (mLfromL) {
    const liters = Number(mLfromL[1]);
    if (!Number.isNaN(liters)) return Math.round(liters * 1000);
  }

  const mL = raw.match(/^([0-9]+)\s*(мл|ml)?$/i);
  if (mL) {
    const v = Number(mL[1]);
    if (!Number.isNaN(v)) return v;
  }

  return undefined;
}

const productFormSlice = createSlice({
  name: 'productForm',
  initialState,
  reducers: {
    reset: () => initialState,

    hydrateFromServer: (state, action: PayloadAction<Partial<ProductFormState>>) => {
      const p = action.payload;
      state.id = p.id;
      state.name = p.name;
      state.status = p.status ?? 'DRAFT';
      state.brandId = p.brandId;
      state.description = p.description;
      state.seoTitle = p.seoTitle ?? null;
      state.seoDescription = p.seoDescription ?? null;
      state.variants = p.variants?.length ? p.variants : initialState.variants;
      state.images = p.images ?? [];
      state.coverId = p.coverId ?? null;
      state.coverFallbackUrl = p.coverFallbackUrl ?? null;
      ensureCover(state);
    },

    setField: <K extends keyof ProductFormState>(
      state: Draft<ProductFormState>,
      action: PayloadAction<{ key: K; value: ProductFormState[K] }>,
    ) => {
      state[action.payload.key] = action.payload.value as ProductFormState[K];
      if (action.payload.key === 'images' || action.payload.key === 'coverId') {
        ensureCover(state);
      }
    },

    addVariant: (state) => {
      state.variants.push({ position: state.variants.length });
    },
    removeVariant: (state, action: PayloadAction<number>) => {
      state.variants = state.variants.filter((_, i) => i !== action.payload);
      state.variants = state.variants.map((v, i) => ({ ...v, position: i }));
    },
    updateVariant: (
      state,
      action: PayloadAction<{ index: number; patch: Partial<VariantForm> }>,
    ) => {
      const { index, patch } = action.payload;
      const arr = [...state.variants];
      arr[index] = { ...arr[index], ...patch, position: arr[index].position };
      state.variants = arr;
    },

    setVariantsFromValues: (
      state,
      action: PayloadAction<{ optionName: string; values: string[] }>,
    ) => {
      const values = action.payload.values.map((s) => s.trim()).filter(Boolean);

      state.variants = values.map((label, i) => ({
        position: i,
        label,
        volumeMl: parseVolumeToMl(label),
      }));
    },

    setVariantImage: (
      state,
      action: PayloadAction<{
        index: number;
        media: { id: string; url: string; publicId?: string | null };
      }>,
    ) => {
      const { index, media } = action.payload;
      if (!state.variants[index]) return;
      state.variants[index].imageId = media.id;
      state.variants[index].imageUrl = media.url;
      state.variants[index].imagePublicId = media.publicId ?? null;
    },

    clearVariantImage: (state, action: PayloadAction<number>) => {
      const idx = action.payload;
      if (!state.variants[idx]) return;
      state.variants[idx].imageId = null;
      state.variants[idx].imageUrl = null;
      state.variants[idx].imagePublicId = null;
    },

    addImages: (state, action: PayloadAction<MediaItem[]>) => {
      state.images = [...state.images, ...action.payload];
      if (!state.coverId && action.payload.length > 0) {
        state.coverId = action.payload[0].id;
      }
      ensureCover(state);
    },
    removeImage: (state, action: PayloadAction<string>) => {
      state.images = state.images.filter((m) => m.id !== action.payload);
      if (state.coverId === action.payload) {
        state.coverId = state.images[0]?.id ?? null;
      }
      ensureCover(state);
    },
    reorderImages: (state, action: PayloadAction<{ activeId: string; overId: string }>) => {
      const { activeId, overId } = action.payload;
      if (activeId === overId) return;
      const oldIndex = state.images.findIndex((i) => i.id === activeId);
      const newIndex = state.images.findIndex((i) => i.id === overId);
      if (oldIndex < 0 || newIndex < 0) return;
      state.images = arrayMove(state.images, oldIndex, newIndex);
      ensureCover(state);
    },
    setCover: (state, action: PayloadAction<string | null>) => {
      state.coverId = action.payload;
      ensureCover(state);
    },
  },
});

export const {
  reset,
  hydrateFromServer,
  setField,
  addVariant,
  removeVariant,
  updateVariant,
  setVariantsFromValues,
  setVariantImage,
  clearVariantImage,
  addImages,
  removeImage,
  reorderImages,
  setCover,
} = productFormSlice.actions;

export default productFormSlice.reducer;

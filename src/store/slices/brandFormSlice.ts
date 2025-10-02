import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type BrandFormState = {
  id?: string;
  name?: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVE';
  description?: string;
  seoTitle?: string | null;
  seoDescription?: string | null;

  coverId: string | null;
  coverUrl: string | null;
  coverPublicId?: string | null;
};

const initialState: BrandFormState = {
  status: 'DRAFT',
  description: '',
  seoTitle: null,
  seoDescription: null,
  coverId: null,
  coverUrl: null,
  coverPublicId: null,
};

const brandFormSlice = createSlice({
  name: 'brandForm',
  initialState,
  reducers: {
    reset: () => initialState,

    hydrateFromServer: (state, action: PayloadAction<Partial<BrandFormState>>) => {
      const b = action.payload;
      state.id = b.id;
      state.name = b.name;
      state.status = b.status ?? 'DRAFT';
      state.description = b.description ?? '';
      state.seoTitle = b.seoTitle ?? null;
      state.seoDescription = b.seoDescription ?? null;
      state.coverId = b.coverId ?? null;
      state.coverUrl = b.coverUrl ?? null;
      state.coverPublicId = b.coverPublicId ?? null;
    },

    setField: (
      state: BrandFormState,
      action: PayloadAction<{
        key: keyof BrandFormState;
        value: BrandFormState[keyof BrandFormState];
      }>,
    ) => {
      const { key, value } = action.payload;
      (state as any)[key] = value; // безопасно для immer при индексном доступе
    },

    setCoverMedia: (
      state,
      action: PayloadAction<{ id: string; url: string; publicId?: string | null }>,
    ) => {
      state.coverId = action.payload.id;
      state.coverUrl = action.payload.url;
      state.coverPublicId = action.payload.publicId ?? null;
    },

    clearCover: (state) => {
      state.coverId = null;
      state.coverUrl = null;
      state.coverPublicId = null;
    },
  },
});

export const { reset, hydrateFromServer, setField, setCoverMedia, clearCover } =
  brandFormSlice.actions;

export default brandFormSlice.reducer;

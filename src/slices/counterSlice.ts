import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CounterState {
  user: string | null
}

const initialState: CounterState = {
  user: null
}

export const counterSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    adduser: (state,action) => {
        state.user = action.payload
    },
  },
})

export const { adduser } = counterSlice.actions;

export default counterSlice.reducer
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, logoutUser, registerUser } from '../utils/api';

// Login
export const authenticateUser = createAsyncThunk(
    'login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await loginUser(email, password);
            if (response.status !== 200) {
                return rejectWithValue({ message: response.message });
            }
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Register
export const register = createAsyncThunk(
    'register', async({ name, email, password }, { rejectWithValue }) => {
        try {
            const response = await registerUser(name, email, password);
            if (response.status !== 201) {
                return rejectWithValue({ message: response.message })
            }
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Logout
export const logout = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            const response = await logoutUser();
            console.log(response);
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isLoading: false,
        error: null,
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            // Login Handlers
            .addCase(authenticateUser.pending, (state) => {
                state.isLoading = true;
                state.error = null; 
            })
            .addCase(authenticateUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload
                state.error = null;
            })
            .addCase(authenticateUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload.message;
            })

            // Register Handlers
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = null; 
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload
                state.error = null;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload.message;
            })

            // Logout Handlers
            .addCase(logout.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.error = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload.message;
            })
    },
});

// export const { logout } = authSlice.actions;
export default authSlice.reducer;

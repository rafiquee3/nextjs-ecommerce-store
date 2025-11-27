import z from "zod";

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MULTPILE_SPACES_REGEX = /\s+/g;

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string; 
  stock: number; 
  isFeatured: boolean; 
  isActive: boolean; 
}

export const ProductSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters long.").max(100),
  price: z.number("Enter a valid number.").min(0.01, "Price must be greater than zero."),
  description: z.string().min(10, "Description must be more detailed.").max(500),
  imageUrl: z.string().url("Must be a valid image URL.").nonempty(),
  category: z.string().nonempty("Category is required."),
  stock: z.number("Enter a valid number.").int("Value must be an integer.").min(0, "The stock level cannot be negative."),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
});

export const InitialProductSchema = ProductSchema.extend({
  imageUrl: ProductSchema.shape.imageUrl.optional().or(z.literal('')), 
});
export type InitialProductFormData = z.infer<typeof InitialProductSchema>;

export type ProductFormData = z.infer<typeof ProductSchema>;

export interface Category {
  id: number;
  name: string; 
  slug: string; 
  description: string;
  productCount: number; 
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number; 
  imageUrl: string; 
}

export const CategorySchema = z.object({
  name: z.string().min(3, "The category name must have a minimum of 3 characters.").max(30),
  slug: z.string()
    .trim()
    .toLowerCase()
    .min(3, "The slug must contain at least 3 characters.")
    .max(50, "The slug must not exceed 50 characters.")
    .regex(SLUG_REGEX, "Invalid slug format. Use only lowercase letters, numbers, and single hyphens. No leading/trailing hyphens allowed.")
    .nonempty(),
  description: z.string().min(10, "The description must be more detailed.").max(500),
  productCount: z.number('Enter a valid number.').int("The value must be an integer.").min(0, "The stock level cannot be negative.")
});
export const InitialCategorySchema = CategorySchema.extend({
  slug: CategorySchema.shape.slug.optional().or(z.literal('')), 
});
export type InitialCategoryFormData = z.infer<typeof InitialCategorySchema>;
export type CategorieFormData = z.infer<typeof CategorySchema>;

export interface User {
  id: number;
  login: string;
  email: string;
  hashedPassword: string;
  role: 'user' | 'admin';
}

const loginRegex = /^[a-zA-Z0-9_-]+$/;

export const loginValidation = z.string()
  .min(3, "Login must be at least 3 characters long.")
  .max(20, "Login can be a maximum of 20 characters long.")
  .trim()
  .regex(
    loginRegex, 
    "Login can only contain letters, numbers, hyphens (-), and underscores (_)."
  )

export const emailValidation = z.string().email({ message: "Invalid Email" });

export const passwordValidation = z
  .string()
  .min(8, { message: "Password should have minimum length of 8" })
  .max(15, "Password is too long")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+]{8,}$/, 'Should Contain at least one uppercase letter and have a minimum length of 8 characters.');

export const SignUpSchema = z.object({
  login: loginValidation,
  email: emailValidation,
  password: passwordValidation,
});

export type SignUpFormData = z.infer<typeof SignUpSchema>;

export const LoginFormSchema = z.object({
  login: loginValidation,
  password: passwordValidation,
});

export type LoginFormData = z.infer<typeof LoginFormSchema>;

export type AuthUser = {
    role: 'user' | 'admin',
}

export interface SessionUser {
    user: AuthUser
}

export type FilterParams = {
  page?: number,
  limit?: number,
  category?: string,
  sort?: string,
  q?: string
}

export interface  ProductsPageProps {
  searchParams: FilterParams;
}

export interface  CategoriesPageProps {
  searchParams: FilterParams;
}

export const createProductSearchSchema = (validCategories: string[]) => z.object({
  category: z.string() 
    .optional() 
    .transform(val => (val ? val.toLowerCase() : val)) 
    .pipe(z.enum(validCategories).default('all')),
  limit: z.enum(['6', '12', '18', '24'])
    .optional() 
    .default('12')
    .transform(s => Number(s))
    .pipe(z.number().int().positive()),

  sort: z.enum(['price_asc', 'price_desc', 'name_asc', 'name_desc', 'default'])
    .optional() 
    .default('default'),
    
  page: z.string()
    .optional() 
    .default('1')
    .transform(s => Number(s))
    .pipe(z.number().int().positive('The provided page is not a valid number')),
    
  q: z.string().trim().optional().default(''), 
  
}).strict();

export const createRandomSearchSchema = (validCategories: string[]) => z.object({
  category: z.string() 
    .transform(val => (val ? val.toLowerCase() : val)) 
    .pipe(z.enum(validCategories)),
    
  limit: z.string()
    .optional() 
    .default('7')
    .transform(s => Number(s))
    .pipe(z.number().int().positive().max(20)),
}).strict();

export const createCategorySearchSchema = (validCategories: string[]) => z.object({
  category: z.string() 
    .optional() 
    .transform(val => (val ? val.toLowerCase() : val)) 
    .pipe(z.enum(validCategories).default('all')),
  limit: z.enum(['6', '12', '18', '24'])
    .optional() 
    .default('6')
    .transform(s => Number(s))
    .pipe(z.number().int().positive()),

  sort: z.enum(['stock_asc', 'stock_desc', 'name_asc', 'name_desc', 'default'])
    .optional()
    .default('default'),
    
  page: z.string()
    .optional() 
    .default('1')
    .transform(s => Number(s))
    .pipe(z.number().int().positive('The provided page is not a valid number')),
    
  q: z.string().trim().optional().default(''), 
  
}).strict();

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number; 
  imageUrl: string; 
}

const CartItemSchema = z.object({
  id: z.number().min(1, { message: "Product ID is required." }),
  name: z.string().min(1, { message: "Product name is required." }),
  quantity: z.number("Quantity must be a number.")
    .int("Quantity must be a whole number.")
    .positive("Quantity must be positive.")
    .max(999, "Quantity limit exceeded."),
  price: z.number().positive("Price must be positive."),
  imageUrl: z.string()
});

export const CheckoutFormSchema = z.object({
    email: emailValidation,
    phone: z.union([
              z.string()
                .trim()
                .nonempty()
                .regex(/^(?:(?:\+|00)33[\s.-]{0,3}|0)[\s.-]{0,3}[1-9](?:[\s.-]{0,3}\d{2}){4}$/ ,'Provided number is invalid.')
              ,
              z.literal('') 
            ])
    ,
    first_name: z.string()
                .trim()
                .nonempty('First name is required.')
                .max(25, 'First name can contain a maximum of 25 characters.')
                .regex(/^[a-z\s'-]{1,25}$/i)
                .transform(val => val.replace(MULTPILE_SPACES_REGEX, '')),
    last_name: z.string()
               .trim()
               .nonempty('Last name is required.')
               .max(45, 'Last name can contain a maximum of 45 characters.')
               .regex(/^[a-z\s'-]{1,45}$/i)
               .transform(val => val.replace(MULTPILE_SPACES_REGEX, '')),
    address: z.string()
             .trim()
             .nonempty('Address is required.')
             .max(25, 'First name can contain a maximum of 25 characters.')
             .transform(val => val.replace(MULTPILE_SPACES_REGEX, '')),
    city: z.string()
          .trim()
          .nonempty('City name is required.')
          .regex(/^[a-z\s'-]{2,40}/i, 'The provided city name is invalid')
          .transform(val => val.replace(MULTPILE_SPACES_REGEX, '')),
    zip: z.string()
        .trim()
        .nonempty('Postal Code is required.')
        .regex(/^\d{5}$/, 'Postal Code must be exactly 5 digits.')
        .transform(val => val.replace(MULTPILE_SPACES_REGEX, '')),
    paymentMethod: z.enum(['card', 'paypal']),
    items: z.array(CartItemSchema)
      .min(1, 'Your cart cannot be empty. Please add products before checking out.')
      .max(100, 'Cart item limit exceeded.')
      .refine((items) => items.reduce((acc, item) => acc + item.quantity, 0) > 0, 'Total quantity of products must be greater than zero.'),
});

export type CheckoutFormData = z.infer<typeof CheckoutFormSchema>;
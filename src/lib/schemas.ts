/** @format */

import { z } from "zod";

export const loginUserSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email must be a valid email." }),
  password: z.string({ required_error: "Password is required" }),
});

const imageTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
];

export const createProjectSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, { message: "Name is required" })
    .max(64, { message: "Name must be 64 characters or less" })
    .trim(),
  tagline: z
    .string({ required_error: "Tagline is required" })
    .min(1, { message: "Tagline is required" })
    .max(64, { message: "Tagline must be 64 characters or less" })
    .trim(),
  url: z
    .string({ required_error: "URL is required" })
    .url({ message: "URL must be a valid URL" }),
  description: z
    .string({ required_error: "Description is required" })
    .min(1, { message: "Description is required" })
    .max(512, { message: "Description must be less than 512 characters" })
    .trim(),
  thumbnail: z
    .instanceof(Blob)
    .optional()
    .superRefine((val, ctx) => {
      if (val) {
        if (val.size > 5242880) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Thumbnail must be less than 5MB",
          });
        }

        if (!imageTypes.includes(val.type)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Unsupported file type. Supported formats: jpeg, jpg, png, webp, svg, gif",
          });
        }
      }
    }),
  user: z.string({ required_error: "User is required." }),
});

export const updateProjectSchema = createProjectSchema.omit({ user: true });

export const updateUsernameSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(3, { message: "Username must be at least 3 characters" })
    .max(24, { message: "Username must be 24 characters or less" })
    .regex(/^[a-zA-Z0-9]*$/, {
      message: "Username can only contain letters or numbers.",
    }),
});

export const updateProfileSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, { message: "Name is required" })
    .max(64, { message: "Name must be 64 characters or less" })
    .trim(),
  avatar: z
    .instanceof(Blob)
    .optional()
    .superRefine((val, ctx) => {
      if (val) {
        if (val.size > 5242880) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Avatar must be less than 5MB",
          });
        }

        if (!imageTypes.includes(val.type)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Unsupported file type. Supported formats: jpeg, jpg, png, webp, svg, gif",
          });
        }
      }
    }),
});

export const createLoanSchema = z.object({
  firstName: z
    .string({ required_error: "First name is required" })
    .min(1, { message: "First name is required" })
    .max(64, { message: "First name must be 64 characters or less" })
    .trim(),
  lastName: z
    .string({ required_error: "Last name is required" })
    .min(1, { message: "Last name is required" })
    .max(64, { message: "Last name must be 64 characters or less" })
    .trim(),
  phoneNumber: z
    .string({ required_error: "Phone Number is required" })
    .regex(/^\d{10,14}$/, {
      message: "Phone Number must be between 10 and 12 digits",
    })
    .trim(),
  emailAddress: z
    .string({ required_error: "Email Address is required" })
    .email({ message: "Invalid email address" })
    .max(254, { message: "Email Address must be 254 characters or less" })
    .trim(),
  user: z.string({ required_error: "User is required." }),
});

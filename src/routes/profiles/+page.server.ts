/** @format */
// src/routes/profiles/+page.server.ts

import { error, fail, redirect } from "@sveltejs/kit";
import { updateProfileSchema } from "$lib/schemas";
import { validateData } from "$lib/utils";
import { serialize } from "object-to-formdata";

export const load = async ({ locals }) => {
  if (!locals.pb.authStore.isValid) {
    throw redirect(303, "/login");
  }
};

export const actions = {
  updateProfile: async ({ request, locals }) => {
    const body = await request.formData();

    const { formData, errors } = await validateData(body, updateProfileSchema);
    const { ...rest } = formData;

    if (errors) {
      return fail(400, {
        data: rest,
        errors: errors.fieldErrors,
      });
    }

    try {
      if (!locals.user || !locals.user.id) {
        throw new Error("User is not authenticated");
      }

      const updatedUser = await locals.pb
        .collection("users")
        .update(locals.user.id, serialize(formData));

      // Update local user object with new values
      locals.user.name = updatedUser.name || locals.user.name;
    } catch (err) {
      console.log("Error updating profile:", err);
      // Use default status code if not provided by the error
      throw error(
        err.status || 500,
        err.message || "Something went wrong updating your profile"
      );
    }

    return {
      success: true,
    };
  },
};

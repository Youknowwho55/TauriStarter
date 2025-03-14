/** @format */
// /src/routes/profiles/account/+page.server.ts

import { error, fail, redirect } from "@sveltejs/kit";
import { updateEmailSchema, updateUsernameSchema } from "$lib/schemas";
import { validateData } from "$lib/utils";

export const actions = {
  updateUsername: async ({ request, locals }) => {
    try {
      const formData = await request.formData();
      const { formData: validatedData, errors } = await validateData(
        formData,
        updateUsernameSchema
      );

      if (errors) {
        return fail(400, {
          data: validatedData,
          errors: errors.fieldErrors,
        });
      }

      try {
        await locals.pb
          .collection("users")
          .getFirstListItem(`username = "${validatedData.username}"`);
        // If username exists, return an error or handle it as needed
        return fail(400, {
          data: validatedData,
          errors: { username: "Username already exists" },
        });
      } catch (err) {
        if (err.status === 404) {
          try {
            const { username } = await locals.pb
              .collection("users")
              .update(locals.user.id, { username: validatedData.username });
            locals.user.username = username;
            return {
              success: true,
            };
          } catch (updateErr) {
            console.log("Error updating username:", updateErr);
            throw error(
              updateErr.status || 500,
              updateErr.message || "Failed to update username"
            );
          }
        }

        console.log("Error fetching username:", err);
        throw error(
          err.status || 500,
          err.message || "Failed to check username"
        );
      }
    } catch (err) {
      console.log("Error in updateUsername:", err);
      throw error(
        err.status || 500,
        err.message || "Failed to update username"
      );
    }
  },
};

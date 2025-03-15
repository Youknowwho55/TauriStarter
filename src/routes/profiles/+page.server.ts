/** @format */

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

      const updatedUser = await db.user.update({
        where: { id: locals.user.id },
        data: serialize(formData),
      });

      locals.user.name = updatedUser.name || locals.user.name;
    } catch (err) {
      console.log("Error updating profile:", err);
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

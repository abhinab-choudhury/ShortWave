// models/Workspace.ts

import mongoose from "mongoose";

/**
 * Workspace model
 * A workspace is a container owned by a user that holds many short URLs.
 * It helps users organize URLs by project, campaign, etc.
 */

const workspaceSchema = new mongoose.Schema(
  {
    // Name of the workspace (e.g., "Product Launch", "Marketing")
    name: {
      type: String,
      required: true,
    },

    // Reference to the user who owns this workspace
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Workspace", workspaceSchema);

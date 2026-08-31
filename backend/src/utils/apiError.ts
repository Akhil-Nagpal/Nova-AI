// ═══════════════════════════════════════════════════════════════════
// ApiError Class - Custom Error Handler for API
// ═══════════════════════════════════════════════════════════════════
// This class creates custom error objects that we can throw in our API
// It extends (inherits from) JavaScript's built-in Error class
// ═══════════════════════════════════════════════════════════════════

class ApiError extends Error {
  // ─────────────────────────────────────────────────────────────────
  // PROPERTIES (What data this error will store)
  // ─────────────────────────────────────────────────────────────────

  // HTTP status code (404 = Not Found, 500 = Server Error, etc.)
  statusCode: number;

  // Additional data to send (usually null for errors)
  data: any;

  // Array of detailed errors (useful for validation errors)
  // Example: [{ field: "email", message: "Email is required" }]
  error: any[];

  // Whether the request was successful (always false for errors)
  success: boolean;

  // ─────────────────────────────────────────────────────────────────
  // CONSTRUCTOR (Runs automatically when you create a new ApiError)
  // ─────────────────────────────────────────────────────────────────
  // Example usage: new ApiError(404, "User not found")
  // ─────────────────────────────────────────────────────────────────

  constructor(
    // PARAMETER 1: HTTP status code (REQUIRED)
    // Must provide this when creating error
    // Example: 404, 500, 401, 400
    statusCode: number,

    // PARAMETER 2: Error message (OPTIONAL)
    // If not provided, uses default: "Something went wrong!"
    // Example: "User not found", "Invalid credentials"
    message = "Something went wrong!",

    // PARAMETER 3: Array of detailed errors (OPTIONAL)
    // Default is empty array []
    // Use for validation errors with multiple fields
    // Example: [{ field: "email", message: "Invalid email" }]
    error: any[] = [],

    // PARAMETER 4: Custom stack trace (OPTIONAL)
    // Usually leave empty - auto-generated
    // Stack trace shows where error occurred in code
    stack = "",
  ) {
    // ───────────────────────────────────────────────────────────────
    // STEP 1: Call parent class (Error) constructor
    // ───────────────────────────────────────────────────────────────
    // super() MUST be called first in child class constructors
    // It initializes the Error class with the message
    // This gives us basic error features like .message and .stack
    super(message);

    // ───────────────────────────────────────────────────────────────
    // STEP 2: Set our custom properties
    // ───────────────────────────────────────────────────────────────

    // Store the HTTP status code
    // Example: 404, 500, 401
    this.statusCode = statusCode;

    // Set data to null (errors don't return data)
    // Only successful responses return data
    this.data = null;

    // Store the validation errors array
    // Will be [] if no errors passed, or the array you provided
    this.error = error;

    // Set success to false (this is an error, so it failed)
    // Successful responses would have success: true
    this.success = false;

    // ───────────────────────────────────────────────────────────────
    // STEP 3: Handle stack trace (shows where error happened)
    // ───────────────────────────────────────────────────────────────

    // Check if a custom stack trace was provided
    if (stack) {
      // Use the custom stack trace (rare case)
      this.stack = stack;
    } else {
      // Auto-generate stack trace (most common case)
      // Error.captureStackTrace creates a stack trace showing:
      // - Which file the error occurred in
      // - Which line number
      // - Which function called it
      // Example output:
      // Error: User not found
      //   at UserController.getUser (user.controller.ts:45:11)
      //   at Layer.handle (express/lib/router/layer.js:95:5)
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
// EXPORT - Make ApiError available in other files
// ═══════════════════════════════════════════════════════════════════
// Now you can import it like: import { ApiError } from "./ApiError"
export { ApiError };

// ═══════════════════════════════════════════════════════════════════
// HOW TO USE THIS CLASS
// ═══════════════════════════════════════════════════════════════════
//
// Example 1: Simple 404 error
// throw new ApiError(404, "User not found");
//
// Example 2: Validation error with multiple fields
// throw new ApiError(400, "Validation failed", [
//   { field: "email", message: "Email is required" },
//   { field: "password", message: "Password too short" }
// ]);
//
// Example 3: Using default message
// throw new ApiError(500);  // Uses "Something went wrong!"
//
// Example 4: In an Express route handler
// app.get("/user/:id", async (req, res, next) => {
//   const user = await User.findById(req.params.id);
//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }
//   res.json({ success: true, data: user });
// });
//
// ═══════════════════════════════════════════════════════════════════
// WHAT GETS CREATED WHEN YOU THROW AN ERROR
// ═══════════════════════════════════════════════════════════════════
//
// const error = new ApiError(404, "User not found");
//
// The error object looks like:
// {
//   statusCode: 404,                    // Your custom property
//   message: "User not found",          // From Error (parent class)
//   data: null,                         // Your custom property
//   error: [],                          // Your custom property
//   success: false,                     // Your custom property
//   stack: "Error: User not found..."  // From Error (parent class)
// }
//
// ═══════════════════════════════════════════════════════════════════

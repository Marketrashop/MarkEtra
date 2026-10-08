export type ValidationResult = {
  success: boolean;

  message?: string;
};

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin(values: {
  email: string;

  password: string;
}): ValidationResult {
  if (!values.email.trim()) {
    return {
      success: false,
      message:
        "Please enter your email address.",
    };
  }

  if (
    !EMAIL_REGEX.test(values.email)
  ) {
    return {
      success: false,
      message:
        "Please enter a valid email address.",
    };
  }

  if (!values.password) {
    return {
      success: false,
      message:
        "Please enter your password.",
    };
  }

  return {
    success: true,
  };
}

export function validateRegister(values: {
  firstName: string;

  lastName: string;

  phoneNumber: string;

  country: string;

  email: string;

  password: string;

  confirmPassword: string;

  heardFrom: string;

  referralCode: string;

  acceptedTerms: boolean;
}): ValidationResult {
  if (!values.firstName.trim()) {
    return {
      success: false,
      message:
        "Please enter your first name.",
    };
  }

  if (
    values.firstName.trim().length < 2
  ) {
    return {
      success: false,
      message:
        "Your first name must contain at least 2 characters.",
    };
  }

if (!values.phoneNumber.trim()) {
  return {
    success: false,
    message:
      "Please enter your phone number.",
  };
}

if (!values.country.trim()) {
  return {
    success: false,
    message:
      "Please select your country.",
  };
}

  if (!values.email.trim()) {
    return {
      success: false,
      message:
        "Please enter your email address.",
    };
  }

  if (
    !EMAIL_REGEX.test(values.email)
  ) {
    return {
      success: false,
      message:
        "Please enter a valid email address.",
    };
  }

  if (!values.password) {
    return {
      success: false,
      message:
        "Please create a password.",
    };
  }

  if (values.password.length < 6) {
    return {
      success: false,
      message:
        "Password must contain at least 6 characters.",
    };
  }

  if (
    values.password !==
    values.confirmPassword
  ) {
    return {
      success: false,
      message:
        "Passwords do not match.",
    };
  }

  if (
    values.heardFrom ===
      "affiliate" &&
    !values.referralCode.trim()
  ) {
    return {
      success: false,
      message:
        "Please enter your referral code.",
    };
  }

  if (!values.acceptedTerms) {
    return {
      success: false,
      message:
        "Please accept the Terms & Conditions to continue.",
    };
  }

  return {
    success: true,
  };
}

export function validateForgotPassword(
  values: {
    email: string;
  }
): ValidationResult {
  if (!values.email.trim()) {
    return {
      success: false,
      message:
        "Please enter your email address.",
    };
  }

  if (
    !EMAIL_REGEX.test(values.email)
  ) {
    return {
      success: false,
      message:
        "Please enter a valid email address.",
    };
  }

  return {
    success: true,
  };
}

export function validateResetPassword(
  values: {
    password: string;

    confirmPassword: string;
  }
): ValidationResult {
  if (!values.password) {
    return {
      success: false,
      message:
        "Please enter your new password.",
    };
  }

  if (values.password.length < 6) {
    return {
      success: false,
      message:
        "Password must contain at least 6 characters.",
    };
  }

  if (
    values.password !==
    values.confirmPassword
  ) {
    return {
      success: false,
      message:
        "Passwords do not match.",
    };
  }

  return {
    success: true,
  };
}
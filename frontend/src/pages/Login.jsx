import { useState } from "react";
import { Navigate, useLocation } from "react-router";
import { ValidationError, object, string } from "yup";
import { ENDPOINTS, MESSAGES, ROUTES } from "../constants";
import { useAuth } from "../hooks/useAuth";
import { api, getErrorMessage } from "../services/api";

const loginSchema = object({
  email: string().trim().required(MESSAGES.EMAIL_REQUIRED).email(MESSAGES.EMAIL_INVALID),
  password: string().required(MESSAGES.PASSWORD_REQUIRED),
});

export const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const location = useLocation();

  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Si ya hay sesión, vuelve a la página de origen (o al inicio)
  if (isAuthenticated) {
    const from = location.state?.from ?? ROUTES.HOME;
    return <Navigate to={from} replace />;
  }

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    try {
      await loginSchema.validate(values, { abortEarly: false });
    } catch (err) {
      if (err instanceof ValidationError) {
        const fieldErrors = {};
        for (const issue of err.inner) {
          if (issue.path && !fieldErrors[issue.path]) fieldErrors[issue.path] = issue.message;
        }
        setErrors(fieldErrors);
        return;
      }
      throw err;
    }

    setErrors({});
    setSubmitting(true);
    try {
      const { data } = await api.post(ENDPOINTS.LOGIN, {
        email: values.email.trim(),
        password: values.password,
      });
      login(data.token, data.user); // al cambiar el estado, el <Navigate> de arriba redirige
    } catch (err) {
      setServerError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <div className="center-screen">
      <form className="card login-card" onSubmit={handleSubmit} noValidate>
        <h1> Biblioteca</h1>
        <p className="muted">Iniciá sesión como administrador</p>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          value={values.email}
          onChange={handleChange}
          aria-invalid={Boolean(errors.email)}
        />
        {errors.email && <span className="field-error">{errors.email}</span>}

        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          onChange={handleChange}
          aria-invalid={Boolean(errors.password)}
        />
        {errors.password && <span className="field-error">{errors.password}</span>}

        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? "Ingresando…" : "Ingresar"}
        </button>
      </form>
    </div>
  );
};
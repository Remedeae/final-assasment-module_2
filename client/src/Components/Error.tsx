import { useGlobalApiFetch } from "../stores/globalStore";

function ErrorBanner() {
  const error = useGlobalApiFetch((state) => state.error);

  if (!error) return null;

  return (
    <div className="error">
      <p>{error}</p>
    </div>
  );
}

export default ErrorBanner;

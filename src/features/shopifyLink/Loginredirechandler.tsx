/* eslint-disable react-refresh/only-export-components */
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

type ToastFn = (message: string, type?: 'success' | 'error' | 'warning' | 'default') => void;

type Props = {
  onToast?: ToastFn;
};

/**
 * A leading "/" alone is not enough: "//evil.com" and "/\evil.com" are protocol-relative
 * URLs that send the freshly signed-in user straight off the site.
 */
const isSameOriginPath = (value: string) =>
  value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\');

/**
* Add to your existing Login page (or call this hook inside it).
* - Shows ?error= from Shopify OAuth failures
* - After login, sends user to ?redirect= (e.g. /shopify/link?token=...)
*/
export function useLoginRedirectHandler(onToast?: ToastFn) {
  const [searchParams, setSearchParams] = useSearchParams();
  const hasToastedRef = useRef(false);

  useEffect(() => {
    const error = searchParams.get('error');
    const success = searchParams.get('success');

    if (error || success) {
      if (!hasToastedRef.current) {
        hasToastedRef.current = true;
        if (error) {
          onToast?.(decodeURIComponent(error), 'error');
        }
        if (success) {
          onToast?.(decodeURIComponent(success), 'success');
        }
      }
      // Remove query parameters from URL so they only fire once
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('error');
      newParams.delete('success');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams, onToast]);

  function redirectAfterLogin(): boolean {
    const redirect = searchParams.get('redirect');
    if (redirect && isSameOriginPath(redirect)) {
      // Use full navigation so /shopify/link remounts and runs link API
      window.location.href = redirect;
      return true;
    }

    const pending = sessionStorage.getItem('shopify_pending_link_token');
    if (pending) {
      window.location.href = `/shopify/link?token=${encodeURIComponent(pending)}`;
      return true;
    }

    return false;
  }

  return { redirectAfterLogin };
}

/**
* Example wrapper — merge into your real Login component:
*
* const { redirectAfterLogin } = useLoginRedirectHandler(toast);
* // after successful login API call:
* if (!redirectAfterLogin()) navigate('/dashboard');
*/
export default function LoginRedirectHandler({ onToast }: Props) {
  useLoginRedirectHandler(onToast);
  return null;
}
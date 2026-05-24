import { describe, it, expect, beforeEach } from 'vitest';
import { locale, localeCode, setLocale, t, useLocale, availableLanguages } from '../../stores/locale';

describe('locale.js store', () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset to a known state for testing
    setLocale('es');
  });

  it('inicializa con español por defecto', () => {
    expect(locale.value).toBe('es');
    expect(localeCode.value).toBe('es-CO');
  });

  it('setLocale cambia el idioma y persiste en localStorage', () => {
    setLocale('en');
    expect(locale.value).toBe('en');
    expect(localStorage.getItem('focusflow-locale')).toBe('en');
    expect(localeCode.value).toBe('en-US');
  });

  it('setLocale ignora idiomas no soportados', () => {
    // Intentar cambiar a un idioma no definido en el objeto de traducciones
    setLocale('fr');
    expect(locale.value).toBe('es'); // Se mantiene en el anterior
  });

  describe('Función t (traducción)', () => {
    it('traduce una clave simple en ambos idiomas', () => {
      setLocale('es');
      expect(t('common.login')).toBe('Iniciar Sesión');
      
      setLocale('en');
      expect(t('common.login')).toBe('Login');
    });

    it('traduce claves anidadas profundamente', () => {
      setLocale('es');
      expect(t('register.passwordRules.minChars')).toBe('Mínimo 8 caracteres');
    });

    it('retorna el path original si la clave no existe', () => {
      const path = 'some.missing.key';
      expect(t(path)).toBe(path);
    });

    it('realiza interpolación de valores correctamente', () => {
      setLocale('es');
      // Clave: "Puedes guardar otro registro en {seconds}s"
      const result = t('dashboard.saveTimer', { seconds: '45' });
      expect(result).toBe('Puedes guardar otro registro en 45s');
    });

    it('maneja valores faltantes en la interpolación manteniendo la clave visualmente', () => {
      setLocale('en');
      // Clave: "You can save again in {seconds}s"
      const result = t('dashboard.saveTimer');
      // El código usa un carácter especial de control como marcador de error
      expect(result).toContain('seconds');
    });

    it('devuelve el path si un segmento intermedio de la ruta no existe', () => {
      expect(t('common.invalid_segment.login')).toBe('common.invalid_segment.login');
    });
  });

  it('useLocale retorna el estado reactivo y las funciones necesarias', () => {
    const { locale: l, localeCode: lc, availableLanguages: al, setLocale: sl, t: trans } = useLocale();
    
    expect(l).toBe(locale);
    expect(lc).toBe(localeCode);
    expect(al).toBe(availableLanguages);
    expect(sl).toBe(setLocale);
    expect(trans).toBe(t);
  });
});
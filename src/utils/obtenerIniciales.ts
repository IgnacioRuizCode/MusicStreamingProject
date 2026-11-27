export function obtenerIniciales(nombre: string): string {
  const normalizado = nombre.trim().replace(/\s+/g, ' ');

  if (!normalizado) {
    return '';
  }

  const partes = normalizado.split(',');

  if (partes.length > 1) {
    const nombrePartes = partes.slice(1).join(' ').trim().split(' ');
    const apellidoPartes = partes[0].trim().split(' ');

    return [nombrePartes[0], apellidoPartes[0]]
      .filter(Boolean)
      .map((parte) => parte.charAt(0))
      .join('')
      .toUpperCase();
  }

  const palabras = normalizado.split(' ');
  const segunda = palabras.length > 1 ? palabras[palabras.length - 1] : '';

  return [palabras[0], segunda]
    .filter(Boolean)
    .map((palabra) => palabra.charAt(0))
    .join('')
    .toUpperCase();
}

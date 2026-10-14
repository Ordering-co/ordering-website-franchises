# Evidencia del onboarding de Franquicias

Verificado el 14 de octubre de 2026 en la rama `codex/sergio-137-product-onboarding`, base `3d8820f`. Esta evidencia distingue comandos, pruebas sintéticas y comprobación de navegador. No se publicó. Esta implementación no cambia el backend.

| Comprobación | Resultado | Evidencia |
| --- | --- | --- |
| Runtime | Node 24.21.0, pnpm 9.15.0 | `.nvmrc`, `packageManager`, wrappers `scripts/check-node.cjs` |
| Instalación | PASS frozen | `HUSKY=0 pnpm install --frozen-lockfile`; resolución omitida, lockfile sin diff |
| Build | PASS | `pnpm build`; avisos existentes de ciclos entre chunks y tamaño superior a 500 kB |
| Lint | PASS | `pnpm lint:check`; se corrigieron además tres comillas preexistentes de dos tests sin cambiar sus assertions |
| i18n | PASS | `pnpm i18n:verify`: 1103 claves; `pnpm i18n:check-generated`: coincide con escaneo |
| Helper común y adapter real | PASS, 32 tests | `pnpm setup:test`; fixtures temporales, no backend real ni configuración del checkout |
| Runtime seleccionado | PASS, 46 tests / 6 archivos | Scope A/B no destructivo, SDK original, ID numérico y consumidores root/home/cart/productos/checkout |
| Suite completa + cobertura | PASS, 254 archivos / 772 tests | `pnpm test:coverage` terminó con exit 0 tras las correcciones de scope, ID, push y navegación local |
| Cobertura estricta | PASS, 77.56% / umbral 70% | `node scripts/coverage-summary.js --no-run --strict`; inventario de 251 fuentes con tests, no todo el código |
| Preview sin push y catálogo público | PASS, 12 tests / 5 archivos | No cola/SDK OneSignal local, Firebase sin permission/worker/token, badge local y navegación sin guest save; producción conserva el flujo de invitado |
| Catálogo sin Maps ni dirección | PASS, 28 tests / 5 archivos | Defaults públicos preparados antes de proveedores; parámetros de lectura pickup/location; opciones personales intactas; sin autoactivar tienda |
| Layout del catálogo local | PASS en navegador real | Título de tarjeta: x=94.5, y=342.5, ancho=648 en viewport de 1269 px; captura del catálogo visible |
| Datos protegidos | Lockfile, licencia y SDK conservados | `pnpm-lock.yaml`, `.gitmodules`, `license-ordering.txt` y gitlink `3d0d34b42fb2dacfe640baaa8234eb9f4d2a0f72` intactos; configuración e indicador temporales de QA a restaurar por la sesión principal antes de integrar |
| Navegador con franquicia real | PASS en catálogo y HMR | Proyecto y franquicia elegidos explícitamente; tarjeta real visible y edición del indicador aplicada sin recarga |

## Qué prueban los tests

El manifest del producto usa `persist:id`: el CLI recibe un slug explícito para la primera configuración y persiste su ID numérico, compatible con el SDK de producción. Una selección numérica ya configurada y del mismo proyecto puede reutilizarse. Si falta, no hace requests ni crea backup. Una selección sintética se guarda sólo tras el lookup filtrado por slug exacto y habilitado; el resto del JSON conserva todas sus propiedades. El adapter real verifica que `franchiseSlug` sea un número y el resumen público incluya su ID y slug. `doctor` confirma el proyecto/franquicia públicos, y `restore` recupera bytes exactos. Los tests comunes cubren respuesta inválida, mismatch, franquicia deshabilitada, confirmación de cambio, no-op, backup, atomicidad, restauración, symlinks y resumen de detección sin datos privados.

El runtime local fija API, socket, proyecto y franquicia ante inyección antigua, dominio y tema remoto. Antes de montar los proveedores se resuelve el slug elegido a un ID numérico positivo, exacto y habilitado para los filtros `franchise_id` del SDK. El snapshot conserva el selector original: el helper V2 persiste un ID numérico y el runtime acepta también un slug anterior. El slug humano resuelto se mantiene aparte para la etiqueta local. Todos los consumidores reciben el ID efectivo, incluidos home, direcciones, carrito, productos y checkout. La fachada de `localStorage` y `sessionStorage` aísla todas las llamadas del SDK y UI por API/versión/idioma/proyecto/franquicia, sin borrar datos globales ni namespaces A/B. `clear()` afecta sólo su propio namespace y la instalación falla cerrada si los getters no se pueden reemplazar. La tienda no monta los proveedores ni consulta datos hasta tener proyecto/franquicia en desarrollo. Producción conserva su resolución de dominio y worker.

## Navegador: catálogo y primera edición

La sesión principal comprobó `/search` con la selección explícita del proyecto y franquicia que muestra el indicador. La tarjeta real «Fast Bite» quedó dentro del viewport: su título tenía x=94.5, y=342.5 y ancho=648, frente a un viewport de 1269 px. Se verificó la imagen renderizada, además del árbol de accesibilidad; no se tomó la presencia de datos en ese árbol como prueba de visibilidad.

![Catálogo real visible dentro del viewport](evidence/franchise-web-catalogue.png)

Después se cambió temporalmente el texto local del indicador a «My verified Franchise edit». HMR actualizó ese nodo sin recargar la página, conservando la selección visible. Esta captura del indicador registra el primer cambio comprobable; la sesión principal restaurará el texto y la configuración temporal antes de integrar.

![Primera edición del indicador aplicada por HMR](evidence/franchise-web-hmr.png)

## Límites

El catálogo i18n coincide con el código; conserva 44 slots vacíos existentes, 46 conflictos y 15 posibles typos informados por el generador. No se modificaron traducciones para esconder esos contadores. La suite de componentes emite avisos de React/jsdom existentes; un test verde no demuestra presentación visual.

Un endpoint público respondió con un listado de franquicias con `slug` y `enabled` boolean. Se inspeccionó únicamente el esquema y los slugs habilitados para pedir una selección; no se guardaron registros ni se cambió la plantilla. La detección local encontró un launcher conectado; eso no configura por sí mismo el frontend ni acredita la pertenencia del usuario por un GET público. El `doctor` contra la plantilla se rechazó sin escritura.

El catálogo local utiliza los tipos/ubicación públicos confirmados, exige pickup habilitado sin dirección y no inventa coordenadas. Se prepara una configuración de lectura separada de `options`, porque el SDK puede sincronizar ese almacenamiento al backend después de un login. Las pruebas confirman que no cambia `options` ni llama a `changeCityFilter`, y que no monta Maps ni activa automáticamente una tienda.

En preview local se omite push y la navegación inicial abre el catálogo público sin crear un invitado ni modificar opciones de pedido. El indicador local muestra proyecto y slug elegidos; producción no lo renderiza. No se verificaron checkout, pagos, notificaciones reales ni login de consumidores. La sesión principal verificó la apariencia del catálogo y la lectura de datos reales mediante las capturas anteriores. La selección de proyecto mediante navegador de Docs#70 sigue pendiente y corresponde únicamente al Marketplace; no se presenta como disponible en Franquicias.

# Subir el sitio a internet — Julia Arena · juliaarena.design

Guía paso a paso, pensada para que **no haga falta saber programar**. Todo lo que
está en el proyecto ya está hecho; vos seguís los pasos en orden.

**Índice**

1. Respaldo (antes de tocar nada)
2. Subir el sitio a GitHub Pages
3. Conectar el dominio juliaarena.design
4. Google Analytics (Tag Manager + el ID que falta)
5. Cookies y privacidad: qué hace el aviso y por qué
6. Verificar que quedó todo bien
7. Rutina cada vez que cambies algo
8. Si algo sale mal

---

## 1. Respaldo (antes de tocar nada)

En el Escritorio hay una copia completa del proyecto en un solo archivo:

```
~/Desktop/Julia-Portfolio-RESPALDO-<fecha>.zip
```

- **Para abrirlo:** doble clic y macOS lo descomprime.
- **Antes de cualquier cambio grande:** hacer otro ZIP (clic derecho sobre la
  carpeta → *Comprimir*). Sobran 5 minutos y evitan disgustos.
- **Importante (iCloud):** la carpeta del proyecto vive dentro de `Documents`,
  que está sincronizado con iCloud. Cuando macOS necesita espacio, "expulsa" los
  archivos grandes del disco y los deja sólo en iCloud (se ven igual, se abren
  igual, pero pesan 0 en el disco). **No se pierde nada**, pero conviene tener
  siempre el ZIP del Escritorio + una copia en un pendrive o disco externo.
  Para volver a bajarlos al disco: clic derecho sobre la carpeta en el Finder →
  *Descargar ahora*.

---

## 2. Subir el sitio a GitHub Pages

GitHub Pages es gratis y sirve el sitio tal cual está en la carpeta (no hay que
compilar nada, es HTML/CSS/JS puro).

> ### ⚡ Opción A — GitHub Desktop (la fácil, recomendada)
>
> El navegador de GitHub tiene dos límites que hacen esta tarea pesada:
> **25 MB por archivo** y **100 archivos por carga** (lo dice la
> [documentación oficial](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)).
> El proyecto tiene 265 archivos y algunos originales de 76 MB, así que habría que
> subirlo en 5 o 6 rondas, a mano. Con **GitHub Desktop** (app gratis y oficial) es
> **un solo paso**:
>
> 1. Descargar GitHub Desktop: <https://desktop.github.com> e instalarlo.
> 2. Abrirlo y elegir **Sign in to GitHub.com** (entrar con la cuenta; **no hace
>    falta ningún token**).
> 3. Menú **File → Add local repository…** y elegir la carpeta
>    `Porfolio Web` (la del proyecto). Si avisa que no es un repositorio, elegí
>    “create a repository” / “add anyway” y listo.
> 4. Arriba dice **Publish repository** → nombre: `portfolio` →
>    **destildá “Keep this code private”** (tiene que ser **público**) → **Publish
>    repository**.
> 5. ¡Listo! Sube todo (265 archivos, con la estructura correcta) y además respeta
>    el `.gitignore`, así que los originales enormes y `node_modules` quedan afuera
>    solos.
>
> Después, para subir cambios nuevos: abrís GitHub Desktop, escribís un resumen,
> **Commit to main** y **Push origin**. Es todo.

> ### 🖱️ Opción B — desde el navegador
>
> Solo si preferís no instalar nada. Reglas: **máximo 100 archivos y 25 MB por
> archivo** en cada carga, y **siempre arrastrar carpetas** (nunca archivos sueltos,
> o se mezclan en la raíz). El orden que funciona:
>
> 1. Los archivos sueltos de la raíz (`index.html`, `404.html`, `CNAME`,
>    `robots.txt`, `sitemap.xml`, `favicon.svg`, `apple-touch-icon.png`, `og.jpg`,
>    `.gitignore`, `DEPLOY.md`) + las carpetas `css` y `js` en una carga.
> 2. La carpeta `images` **por subcarpetas**, una por carga (son 10-38 archivos cada
>    una): `images/luna-care`, `images/shiro-ai`, `images/zeigo-eac`,
>    `images/zeigo-network`, `images/zeigo-eac-landing`, `images/beyond-web-design`.
> 3. Las carpetas `work`, `about` y `privacy`.
> 4. La carpeta `fonts` en dos tandas (tiene 104 archivos: arrastrá la mitad del
>    contenido, y en otra carga el resto).
>
> ⚠️ Nunca arrastres `node_modules` ni los originales enormes (`Shiro_AI.mp4`,
> `FINAL Luna Video.mp4`, `mockup-*.png`, `Schneider-electric-zeigo-network-video
> 2.mp4`): la web no los usa y además superan el límite de 25 MB.

### 2.1. Crear la cuenta y el repositorio (si usás el navegador)

1. Entrar a <https://github.com> y crear una cuenta (o entrar si ya tenés).
2. Arriba a la derecha: **+ → New repository**.
3. **Repository name:** `portfolio` (o el nombre que quieras, sin espacios).
4. **Public** ← tiene que ser público (con privado y cuenta gratis, Pages no anda).
5. **NO** marcar "Add a README file". Clic en **Create repository**.

### 2.2. Subir los archivos (una sola vez)

En la página del repositorio recién creado, buscá el enlace
**"uploading an existing file"**. Después:

- Abrí la carpeta del proyecto en el Finder.
- Seleccioná **todo lo de adentro** de `Porfolio Web` (no la carpeta, el
  contenido: `index.html`, `css`, `js`, `images`, `fonts`, `CNAME`, etc.) y
  arrastralo a la ventana del navegador.
- Abajo, en "Commit changes", escribí `Sitio listo` y clic en **Commit changes**.

> La carga tarda: son ~430 MB (los videos y las imágenes del portfolio). Dejá la
> ventana abierta hasta que termine.

### 2.3. Activar el sitio

1. En el repositorio: **Settings → Pages** (menú de la izquierda).
2. En *Source*: **Deploy from a branch**.
3. *Branch*: **main**, carpeta **/ (root)**. Clic en **Save**.
4. En 1-2 minutos el sitio ya está publicado en
   `https://TU-USUARIO.github.io/portfolio/` y aparece el enlace en esa misma
   pantalla. (Esa URL es provisoria: en el paso 3 le ponemos tu dominio.)


---

## 3. Conectar el dominio juliaarena.design

El dominio ya está puesto en TODO el sitio (canonical, redes sociales, sitemap,
robots, datos estructurados y el archivo `CNAME` que GitHub Pages necesita), así
que sólo hay que configurar el DNS y avisarle a GitHub.

### 3.1. En GitHub

1. **Settings → Pages → Custom domain**: escribir `juliaarena.design` → **Save**.
   (Va a decir que el DNS no está configurado todavía; es normal.)
2. Opcional pero recomendado: **Settings → Pages → Verified domains** y verificar
   el dominio con un registro TXT. Evita que otra persona pueda quedarse con tu
   dominio en GitHub.

### 3.2. ¿Qué es el DNS? (en palabras simples)

El dominio es tu dirección (`juliaarena.design`). El **DNS** es la guía telefónica
de internet: cuando alguien escribe tu dominio, el DNS dice “este nombre vive en
estos servidores”. Esos servidores son los de GitHub Pages, que es donde va a
estar alojado el sitio.

El DNS **no se toca acá**: se configura en el panel donde compraste el dominio
(el mismo lugar donde pagaste — puede ser Namecheap, GoDaddy, Cloudflare,
Hostinger, un registrador de .design, etc.). Ahí buscás una sección que se llama
**DNS Records**, **Administrar DNS** o **Zona DNS**, y cargás los registros de la
tabla de abajo. Si el panel ya trae registros “parking” (A o CNAME que apuntan al
proveedor), hay que borrarlos para que no peleen con los de GitHub.

Resumen de qué es cada tipo de registro:

| Tipo | Para qué sirve |
|---|---|
| `A` | Apunta el dominio a una dirección IP (los 4 de GitHub son los servidores de GitHub Pages). |
| `AAAA` | Igual que `A`, pero para IPv6 (el “idioma” nuevo de internet). Se pueden omitir, pero es mejor ponerlos. |
| `CNAME` | Apunta un subdominio (`www`) a otro nombre (`TU-USUARIO.github.io`), no a una IP. |

### 3.3. En el panel del dominio (donde lo compraste)

Buscá **DNS Records / Zona DNS** y cargá exactamente esto (son los valores
oficiales de GitHub):

| Tipo | Nombre | Valor |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |
| CNAME | `www` | `TU-USUARIO.github.io` (tu usuario real, sin `/portfolio`) |

- Si el panel ya trae registros A o CNAME "parking" del dominio, **borralos**.
- No usar comodines (`*.juliaarena.design`): abren la puerta a robos de dominio.
- El DNS tarda de minutos a 24 horas. Se puede chequear con
  <https://dnschecker.org> escribiendo `juliaarena.design`.

### 3.4. Último paso

Cuando GitHub ya no se queje del DNS: **Settings → Pages → Enforce HTTPS** ✅.
(Puede tardar hasta 24 h en aparecer la opción: es normal, esperá.)

A partir de ahí el sitio vive en **https://juliaarena.design** y
`www.juliaarena.design` redirige solo.

---

## 4. Google Analytics (ya está listo para medir)

### 4.1. Lo que ya está hecho (no hay que tocar nada)

- El **ID de medición `G-MZLEM3X1YK`** está puesto en `js/boot.js` (`var GA_ID`).
  Es la vía directa: mide apenas la persona acepta, sin configurar nada más.
- **Nada de Google se carga hasta que la persona acepta** en el aviso de cookies:
  si rechaza o lo cierra, no se instala ninguna cookie ni se hace un solo pedido a
  Google.
- El sitio avisa cada cambio de ruta (Work, About y cada caso por separado): sin
  eso, al ser de una sola página, Analytics vería únicamente la primera pantalla.
- Se envían las señales de **Consent Mode v2** (`analytics_storage` en `denied`
  hasta que acepta; publicidad siempre `denied`, porque no hay publicidad).
- Tu contenedor de Tag Manager **`GTM-T3LVH4KV`** queda documentado pero **no se
  usa** (no hace falta para una sola propiedad). Si algún día querés medir desde
  Tag Manager: poné ese ID en `GTM_ID`, dejá `GA_ID` vacío y configurá las
  etiquetas en tagmanager.google.com.
- El “ID del flujo” (`16332549445`) es un identificador interno de la propiedad:
  **no hace falta** en ningún lado del sitio.

### 4.2. Comprobar que mide (2 minutos)

1. Abrí el sitio publicado, aceptá las cookies.
2. En Analytics → **Informes → Tiempo real** tenés que verte aparecer en segundos.
3. Navegá a un caso (por ejemplo `/work/luna-care/`): aparece como página nueva.

> Si no ves nada: revisá que hayas aceptado en el aviso, que el `G-...` esté bien
> pegado en `js/boot.js` y que el sitio publicado sea la versión nueva (paso 7).
> Los informes históricos tardan 24-48 h en poblarse; “Tiempo real” es inmediato.

---

## 5. Cookies, privacidad y el aviso

### 5.1. Cómo funciona el aviso

- Aparece **una sola vez** y **recién con el primer scroll** (o el primer toque en
  el celular), así no tapa la animación de entrada de la home.
- Es **corto a propósito**: tres renglones que dicen qué se usa, que sólo se carga
  si aceptás, y un enlace a la Política de Privacidad, donde está todo el detalle.
- Los tres finales posibles se recuerdan: **aceptar**, **rechazar** o **cerrar con
  la ✕**. En los tres casos el aviso **no vuelve a aparecer** (y si rechazás o
  cerrás, no se carga nada de Google).
- En el pie, bajo **Legals**, están **Cookie settings** (reabre el aviso para
  cambiar la decisión) y **Privacy Policy**.

### 5.2. ¿Es legal un aviso tan corto?

Sí, siempre que el detalle esté a un clic. Lo que la normativa pide es: informar
qué se usa y para qué, no cargar nada **antes** del consentimiento, permitir
rechazar con la misma facilidad que aceptar, y poder retirarlo después. Todo eso
está cubierto: el aviso informa y enlaza; la Política de Privacidad tiene el
detalle completo (nombres y duración de las cookies, finalidad, base legal,
retención, derechos y cómo retirar el consentimiento).

### 5.3. La Política de Privacidad (`/privacy/`)

- Es una página aparte (`privacy/index.html`) con el mismo diseño del sitio, y se
  abre **siempre en una pestaña nueva**, así no corta la navegación del portfolio.
- Está en el `sitemap.xml`, así Google también la conoce.
- Todo lo que dice es verificable: las cookies `_ga` y `_ga_<container-id>` con sus
  duraciones salen de
  <https://support.google.com/analytics/answer/11397207>; la retención (2 o 14
  meses) de <https://support.google.com/analytics/answer/7667196>; el IP en
  UE/UK/Suiza de <https://support.google.com/analytics/answer/12017362>; y enlaza a
  las páginas oficiales de Google y de GitHub.

> **Si el sitio cambia** (otra herramienta, otro proveedor, un formulario de
> contacto), hay que actualizar esa página y el aviso. Pedímelo y lo hago.


---

## 6. Verificar que quedó todo bien (5 minutos)

Después de publicar, abrí el sitio y chequeá:

- [ ] `https://juliaarena.design` carga (y arriba dice **juliaarena.design**, no
      `github.io`).
- [ ] Aparece el candado 🔒 (HTTPS) en la barra del navegador.
- [ ] `https://juliaarena.design/about/` y
      `https://juliaarena.design/work/luna-care/` se abren bien, tanto desde el
      menú como escribiendo la dirección a mano.
- [ ] El video de Luna Care se reproduce y no aparece un rectángulo negro.
- [ ] Aparece el aviso de cookies abajo a la izquierda.
- [ ] Al **Aceptar**, en Analytics → Informes → Tiempo real te ves aparecer.
- [ ] Desde el celular: el titular y el botón "LET'S TALK" entran completos.
- [ ] `https://juliaarena.design/sitemap.xml` y
      `https://juliaarena.design/robots.txt` se abren.

**Para que Google te empiece a mostrar** (una sola vez, gratis):

1. Entrá a <https://search.google.com/search-console> con tu Gmail.
2. **Añadir propiedad → Prefijo de la URL** → `https://juliaarena.design`.
3. Verificala (te va a dar un archivo o una etiqueta: si me lo pasás, lo dejo
   puesto en el sitio y lo subimos juntos).
4. En **Sitemaps**, enviá `sitemap.xml`.
5. Tarda unos días en indexar; a las 2-3 semanas ya aparece en los resultados.

---

## 7. Rutina cada vez que cambies algo

El sitio se sirve tal cual está: no hay que compilar nada. Pero hay dos pasos que
evitan el clásico "lo cambié y sigo viendo lo viejo" y "la ruta nueva da 404":

```sh
# 1) subir la versión de caché (el número actual está en index.html: hoy ?v=134)
sed -i '' 's/?v=134/?v=135/g' index.html      # y el de boot.js, escrito a mano

# 2) regenerar las 9 rutas + sitemap + robots (SIEMPRE tras tocar index.html)
node scripts/build-routes.mjs

# 3) chequear que no haya errores
npx eslint js/main.js js/content.js js/boot.js
```

Después, para publicar los cambios **sin Terminal**:

1. En GitHub, entrá a la carpeta del archivo que cambió.
2. **Add file → Upload files**, arrastrá el archivo nuevo con el mismo nombre
   (GitHub reemplaza el viejo) → **Commit changes**.
3. Esperá un minuto y recargá el sitio con **Cmd+Shift+R** (recarga sin caché).

> Lo más simple: pedime el cambio, yo lo hago y te digo exactamente qué archivos
> subir. Y si querés la versión "pro" (un solo comando para subir todo:
> `git add -A && git commit -m "cambios" && git push`), se configura una vez y
> queda listo para siempre.

---

## 8. Si algo sale mal

| Síntoma | Causa casi segura | Solución |
|---|---|---|
| Cambié algo y sigo viendo lo viejo | El navegador guardó la versión anterior | Subir el `?v=` (paso 7.1) y recargar con Cmd+Shift+R |
| `/about/` o `/work/algo/` dan 404 | Faltó regenerar las rutas | `node scripts/build-routes.mjs` y subir los archivos nuevos |
| Se ve sin estilos (texto pelado) | No se subió `css/styles.css` | Subirlo de nuevo |
| Aparece "there is nothing here" | Esa URL no existe | Es correcto: esa es la página de error |
| El aviso de cookies no aparece | Ya elegiste antes en ese navegador | Pie del sitio → **Cookie settings** (o borrar datos del sitio) |
| Analytics no registra nada | Falta la etiqueta GA4 dentro de GTM | Paso 4.2 |
| GitHub dice que el DNS no apunta bien | El DNS todavía no propagó | Esperar (hasta 24 h) y volver a dar Save |
| Un video no se reproduce | Se subió incompleto (pesa mucho) | Volver a subirlo, o avisarme |

**Reglas de oro del proyecto**

- Los archivos **originales** (los videos y PNG enormes de 50-76 MB) **nunca** se
  tocan, renombran ni borran: la web usa copias livianas que viven al lado
  (`luna-care-video-web.mp4`, `poster-*.webp`, etc.). Además están respaldados en
  `~/Desktop/Julia-Portfolio-originales/` y en el ZIP del Escritorio.
- Los comentarios con las runas y el "que el dinero fluya…" del principio de
  `index.html` son parte del sitio: se quedan.
- Si se reemplaza una imagen manteniendo el mismo nombre, hay que subir el `?v=`
  de esa ruta en `js/content.js`.
- Los videos usan el mismo reproductor en todos los casos: se agregan con
  `moveVideo: { src, poster }` (el póster es el primer frame, así nunca aparece un
  rectángulo negro).
- Todo lo de Google depende del consentimiento: si se toca `js/boot.js`, revisar
  que Tag Manager siga cargándose **sólo** desde `jaLoadTags()` (o sea, sólo si la
  persona aceptó).

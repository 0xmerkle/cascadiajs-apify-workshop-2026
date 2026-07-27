# Construye mejores herramientas para agentes con Apify

Taller de CascadiaJS 2026

Los agentes de IA pueden escribir código, pero no pueden ver lo que sucede en la web en vivo. En este taller, construirás y desplegarás una herramienta en la nube que envuelve el RAG Web Browser de Apify con tu propia lógica personalizada, otorgando a cualquier agente de codificación la capacidad de investigar temas utilizando datos web en tiempo real.

## Qué aprenderás

- Cómo funcionan los Actors de Apify
- Cómo llamar a un Actor existente del marketplace desde dentro de tu propio Actor
- Cómo añadir lógica personalizada, como la planificación de búsquedas impulsada por LLM, sobre el Actor
- Cómo desplegar en la nube

## Qué necesitarás

### Cuentas

- Cuenta de Apify en [console.apify.com](https://console.apify.com). Nivel gratuito. Proporcionaremos créditos para todos los asistentes.
- Para la Lección 3: una clave de API de LLM. Elige una:
  - OpenAI: [platform.openai.com](https://platform.openai.com). De pago, mínimo $5.
  - Anthropic: [console.anthropic.com](https://console.anthropic.com). De pago, o incluida con la suscripción de Claude Code.
  - Google Gemini: [aistudio.google.com](https://aistudio.google.com). Completamente gratuito, sin tarjeta de crédito.
  - O sáltate la Lección 3. El actor funciona sin las funciones de LLM.

### Software

#### Git y GitHub

Este taller asume que ya tienes Git instalado y sabes cómo trabajar en una carpeta de proyecto local.

No es necesario clonar este taller durante los ejercicios, pero debes tener acceso a GitHub disponible para guardar o compartir tu trabajo.

```bash
git --version
```

#### Node.js

Usa Node.js 18 o superior. Se recomienda Node 22.

```bash
node --version
```

Usa npm 9 o superior.

```bash
npm --version
```

#### Apify CLI

Instalación:

```bash
npm install -g apify-cli
```

Inicio de sesión:

```bash
apify login
```

Verificación:

```bash
apify --version
apify info
```

#### Agente de codificación

Necesitas acceso a un agente de codificación como Claude Code, Cursor, Codex CLI o similar. Los ejercicios incluyen prompts que le darás a tu agente mientras construyes el Actor.

### Nota para Windows

Claude Code requiere WSL2. Instala todo dentro de WSL.

### Verificación previa

Ejecuta todo esto antes del taller:

```bash
git --version
node --version
npm --version
apify --version
apify info
```

Si algún comando falla, corrígelo antes del taller o levanta la mano al llegar.

## Lecciones

| Lección | Qué harás |
|--------|---------------|
| [01](./01-setup-and-explore.md) | Configurar y explorar RAG Web Browser |
| [02](./02-build-your-actor.md) | Construir tu Actor |
| [03](./03-add-smart-search.md) | Añadir búsqueda inteligente con un LLM |
| [04](./04-deploy.md) | Desplegar en la nube de Apify |
| [05](./05-bonus-agent-skill.md) | Bonus: instalar una habilidad de agente |

La carpeta `reference/` contiene ayudas de copiar y pegar para las partes que deben ser exactas, incluyendo la configuración de entrada de RAG Web Browser y las llamadas al LLM. La carpeta `skills/` contiene una habilidad multi-agente para llamar a tu Actor desplegado.

¿Te has quedado atascado? Levanta la mano.

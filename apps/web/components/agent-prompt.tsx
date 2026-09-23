"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { motionIconProps } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { FALLBACK_SITE_ORIGIN, SITE } from "@/constants/site";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { trackEvent } from "@/lib/events";
import { cn } from "@/lib/utils";

const installCommand = `npx shadcn@latest add ${SITE.REGISTRY}/takumi/text`;

const agentInstallPrompt = `Read the pdfcn agent instructions at ${FALLBACK_SITE_ORIGIN}${ROUTES.LLMS}, then install pdfcn in this project. Use the Takumi renderer by default (components under ${SITE.REGISTRY}/takumi/*); use Forme (${SITE.REGISTRY}/forme/*) only if the project already uses @formepdf/react or the user asks for it. Run ${installCommand}. Then add a basic example that renders a Document and Page from "@/components/pdf/pdf-primitives", wraps the content in PdfcnThemeProvider from "@/components/pdf/theme-provider", and uses Text from "@/components/pdf/text". For complete documents, install a block such as ${SITE.REGISTRY}/takumi/invoice-minimal instead of building from scratch. Preserve the existing Tailwind CSS and shadcn/ui setup. Do not manually rewrite registry components unless the command fails; if it fails, inspect ${FALLBACK_SITE_ORIGIN}/r/takumi/text.json and install the listed dependencies.`;

export const AgentPrompt = ({ className }: { className?: string }) => {
  const { copyToClipboard, isCopied } = useCopyToClipboard({ timeout: 2500 });

  const handleCopy = async () => {
    const hasCopied = await copyToClipboard(agentInstallPrompt);

    if (hasCopied) {
      trackEvent({ name: "copy_agent_prompt" });
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="xs"
      sound="copy"
      aria-live="polite"
      onClick={handleCopy}
      className={cn(
        "text-muted-foreground hover:text-foreground h-7 px-2.5",
        className
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {isCopied ? (
          <motion.span key="done" {...motionIconProps}>
            <CheckIcon />
          </motion.span>
        ) : (
          <motion.span key="idle" {...motionIconProps}>
            <CopyIcon />
          </motion.span>
        )}
      </AnimatePresence>
      {isCopied
        ? "Copied — paste into your agent"
        : "Copy prompt for your agent"}
    </Button>
  );
};

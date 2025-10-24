import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface CustomTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, text: string) => void;
}

const CustomTextModal = ({ isOpen, onClose, onSave }: CustomTextModalProps) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [errors, setErrors] = useState<{ title?: string; text?: string }>({});
  const titleRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    
    // Validation
    const newErrors: { title?: string; text?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!text.trim()) {
      newErrors.text = "Text is required";
    } else if (text.trim().length < 10) {
      newErrors.text = "Text must be at least 10 characters long";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Save and close
    onSave(title.trim(), text.trim());
    handleClose();
  };

  const handleClose = () => {
    setTitle("");
    setText("");
    setErrors({});
    onClose();
  };

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose();
    }
  };

  // Focus management
  useEffect(() => {
    if (isOpen && titleRef.current) {
      // Small delay to ensure modal is fully rendered
      setTimeout(() => {
        titleRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onKeyDown={handleKeyDown}
    >
      <Card 
        className="w-full max-w-2xl bg-background/40 backdrop-blur-xl border-border/50 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary">Add Custom Text</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Title
              </Label>
              <Input
                ref={titleRef}
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your text..."
                className={`bg-background/10 backdrop-blur-sm border-border/70 ${
                  errors.title ? "border-destructive" : ""
                }`}
                autoFocus
                onKeyDown={(e) => e.stopPropagation()}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>

            {/* Text Input */}
            <div className="space-y-2">
              <Label htmlFor="text" className="text-sm font-medium">
                Text Content
              </Label>
              <Textarea
                ref={textareaRef}
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your custom text here... (minimum 10 characters)"
                className={`min-h-[200px] bg-background/10 backdrop-blur-sm border-border/70 resize-none ${
                  errors.text ? "border-destructive" : ""
                }`}
                onKeyDown={(e) => e.stopPropagation()}
              />
              <div className="flex justify-between items-center">
                {errors.text ? (
                  <p className="text-sm text-destructive">{errors.text}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {text.length} characters
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Minimum 10 characters
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="border-border hover:bg-muted"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={!title.trim() || !text.trim() || text.trim().length < 10}
              >
                Save Text
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default CustomTextModal;

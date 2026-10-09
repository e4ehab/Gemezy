"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type LocationDetailsFieldsProps = {
  name: string;
  onNameChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  tagsInput: string;
  onTagsInputChange: (value: string) => void;
  tags: string[];
  hasInvalidTags: boolean;
};

export function LocationDetailsFields({
  name,
  onNameChange,
  description,
  onDescriptionChange,
  tagsInput,
  onTagsInputChange,
  tags,
  hasInvalidTags,
}: LocationDetailsFieldsProps) {
  return (
    <section className="space-y-5 rounded-2xl bg-card p-5 shadow-sm ring-1 ring-foreground/10 sm:p-7">
      <div>
        <h2 className="font-semibold">Give it a name</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Make it easy to find in your collection later.
        </p>
      </div>
      <div className="space-y-2">
        <label htmlFor="location-name" className="text-sm font-medium">
          Location name <span className="text-destructive">*</span>
        </label>
        <Input
          id="location-name"
          value={name}
          onChange={(event) => onNameChange(event.currentTarget.value)}
          placeholder="e.g. Weekend coffee spot"
          minLength={2}
          maxLength={100}
          required
          autoFocus
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="location-description" className="text-sm font-medium">
          Description <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <Textarea
          id="location-description"
          value={description}
          onChange={(event) => onDescriptionChange(event.currentTarget.value)}
          placeholder="What makes this place special?"
          maxLength={500}
          rows={3}
        />
        <p className="text-right text-xs text-muted-foreground">{description.length}/500</p>
      </div>
      <div className="space-y-2">
        <label htmlFor="location-tags" className="text-sm font-medium">
          Search tags{" "}
          <span className="font-normal text-muted-foreground">(optional, up to 10)</span>
        </label>
        <Input
          id="location-tags"
          value={tagsInput}
          onChange={(event) => onTagsInputChange(event.currentTarget.value)}
          placeholder="restaurant, brunch, date night"
          maxLength={320}
        />
        <p className="text-xs leading-5 text-muted-foreground">
          Separate tags with commas. Search for any tag in the navbar.
        </p>
        {hasInvalidTags && (
          <p role="alert" className="text-sm text-destructive">
            Use up to 10 tags, with no more than 30 characters per tag.
          </p>
        )}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {tags.slice(0, 10).map((tag) => (
              <span
                key={tag}
                className="rounded-lg border px-2.5 py-1 text-sm text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Excel interaction schema — what can be entered on top of WorkbookJSON layout.
 * WorkbookJSON = appearance; this schema = input policy.
 */

export const INTERACTION_SCHEMA_VERSION = "1.0";

/**
 * @returns {import('./types').InteractionSchema}
 */
export function createDefaultExcelInteractionSchema() {
  return {
    version: INTERACTION_SCHEMA_VERSION,
    autoInput: {
      enabled: true,
      emptyCells: true,
      defaultType: "number",
      scope: "usedRange",
    },
    editableRegions: [],
    excludedCells: [],
    cellOverrides: [],
  };
}

/**
 * Resolve effective editability for a cell.
 * Priority: Cell Override > Excluded > Auto empty policy > Read-only
 *
 * @returns {{ editable: boolean, type: string, required?: boolean } | null}
 *   null means read-only / not an input
 */
export function resolveCellInteraction(cellRef, interactionSchema, autoEligible) {
  const schema = interactionSchema || createDefaultExcelInteractionSchema();
  const overrides = schema.cellOverrides || [];
  const override = overrides.find((o) => o.cell === cellRef);

  if (override) {
    if (override.editable === false) return null;
    if (override.editable === true || override.type) {
      return {
        editable: true,
        type: override.type || schema.autoInput?.defaultType || "number",
        required: Boolean(override.required),
      };
    }
  }

  if ((schema.excludedCells || []).includes(cellRef)) return null;

  // editableRegions reserved for later — empty means no region restriction in MVP
  if (
    schema.autoInput?.enabled &&
    schema.autoInput?.emptyCells &&
    autoEligible
  ) {
    return {
      editable: true,
      type: schema.autoInput.defaultType || "number",
    };
  }

  return null;
}

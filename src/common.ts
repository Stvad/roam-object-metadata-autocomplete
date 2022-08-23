/**
 * Ideally one would find out the cursor position and then insert the name at the cursor position.
 * But that is not available in the API and would require roamToolkit like hacks
 */
export function reActivateBlock() {
    const focusedBlock = window.roamAlphaAPI.ui.getFocusedBlock()
    return window.roamAlphaAPI.ui.setBlockFocusAndSelection({location: focusedBlock})
}

import ReactDOM from 'react-dom'
import React from 'react'

/**
 * Ideally one would find out the cursor position and then insert the name at the cursor position.
 * But that is not available in the API and would require roamToolkit like hacks
 */
export function reActivateBlock() {
    const focusedBlock = window.roamAlphaAPI.ui.getFocusedBlock()
    return window.roamAlphaAPI.ui.setBlockFocusAndSelection({location: focusedBlock})
}

export const openPageInSidebar = (name: string) => {
    const uid = window.roamAlphaAPI.data.q(
        `[:find ?uid . :where [?e :node/title "${name.replace(/"/g, '\\"')}"] [?e :block/uid ?uid]]`
    ) as unknown as string
    if (uid) {
        window.roamAlphaAPI.ui.rightSidebar.addWindow({
            window: {
                'block-uid': uid,
                type: 'block',
            },
        })
    }
}

export async function createPage({title, tree}: { title: string; tree: { text: string }[] }) {
    const uid = window.roamAlphaAPI.util.generateUID()
    await window.roamAlphaAPI.data.page.create({page: {title, uid}})
    for (let i = 0; i < tree.length; i++) {
        await window.roamAlphaAPI.data.block.create({
            location: {'parent-uid': uid, order: i},
            block: {string: tree[i].text},
        })
    }
}

export function renderOverlay(Component: React.ComponentType<{ onClose: () => void }>) {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const onClose = () => {
        ReactDOM.unmountComponentAtNode(container)
        container.remove()
    }
    ReactDOM.render(React.createElement(Component, {onClose}), container)
}


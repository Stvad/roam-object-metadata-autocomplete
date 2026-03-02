import {createOverlayRender} from 'roamjs-components/util'
import {Classes, Dialog} from '@blueprintjs/core'
import {Suggest} from '@blueprintjs/select'
import {useState} from 'react'
import {createPage} from 'roamjs-components/writes'
import {openPageInSidebar, reActivateBlock} from './common'

import './autocomplete-dialog.css'

interface AutocompletePromptProps {
}

interface BookSuggestion {
    image: string;
    averageRating: string;
    link: string;
    title: string;
    authors: string[]
}

const BookSuggest = Suggest.ofType<BookSuggestion>()

// See more discussion/options at https://gist.github.com/jimmywarting/ac1be6ea0297c16c477e17f8fbe51347
const corsGet = async (url: string) => fetch('https://corsproxy.io/?' + encodeURIComponent(url))

const findBooks = async (name: string) => {
    const response = await corsGet('https://www.goodreads.com/search/index.xml?' + new URLSearchParams({
        'q': name,
        'key': 'YVABuJSFNNFq65uTzRA8Nw',
    }))
    const xml = new DOMParser().parseFromString(await response.text(), 'text/xml')
    const rawBooks = xml.querySelectorAll('GoodreadsResponse > search > results > work')
    return parseBooks(Array.from(rawBooks))
}

const parseBooks = (rawBooks: Element[]): BookSuggestion[] => rawBooks.map(book => {
    const bestBook = book.querySelector('best_book')

    const id = bestBook.querySelector('id').textContent
    return {
        title: bestBook.querySelector('title').textContent,
        authors: Array.from(bestBook.querySelectorAll('author')).map(it => it.querySelector('name').textContent),
        image: bestBook.querySelector('image_url').textContent,
        averageRating: book.querySelector('average_rating').textContent,
        link: `https://goodreads.com/book/show/${id}`,
    }
})

function createPageForBookAndAuthor(item: BookSuggestion) {
    item.authors.forEach(it =>
        createPage({
            title: it,
            tree: [
                {text: 'isa::[[person]] [[author]]'},
                {text: 'connection::[[public figure]]'},
            ],
        }))

    return createPage({
        title: item.title,
        tree: [
            {text: `![](${item.image})`},
            {text: `isa::[[book]]`},
            {text: `author::${item.authors.map(it => `[[${it}]]`).join(' ')}`},
            {text: `link::${item.link}`},
            {text: `averageRating::${item.averageRating}`},
        ],
    })
}

export const AutocompletePrompt = ({onClose}: { onClose: () => void; } & AutocompletePromptProps) => {

    const [bookSuggestions, setBookSuggestions] = useState<BookSuggestion[]>([])

    return (
        <Dialog
            isOpen={true}
            onClose={onClose}
            canEscapeKeyClose
            backdropClassName={'autocomplete-dialog-backdrop'}
            className={'autocomplete-dialog'}
        >
            <div className={Classes.DIALOG_BODY + ' autocomplete-dialog-body'}>

                <h3>GoodReads book</h3>

                <BookSuggest
                    items={bookSuggestions}
                    onQueryChange={async (query) => {
                        setBookSuggestions(await findBooks(query))
                    }}
                    onItemSelect={(item) => {
                        createPageForBookAndAuthor(item).then(() => openPageInSidebar(item.title))
                        window.navigator.clipboard.writeText(`[[${item.title}]]`)

                        onClose()

                        reActivateBlock()
                    }}
                    inputValueRenderer={(item: BookSuggestion) => item.title}
                    itemRenderer={(item: BookSuggestion, {handleClick, modifiers}) => <div
                        onClick={handleClick}>{(modifiers.active ? '*' : '') + item.title}</div>}

                />
            </div>
        </Dialog>
    )
}

// @ts-ignore
export const GoodReadsAutocompletePromptOverlay = createOverlayRender<AutocompletePromptProps>('autocomplete-prompt', AutocompletePrompt)

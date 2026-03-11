import {Classes, Dialog, MenuItem} from '@blueprintjs/core'
import {Suggest} from '@blueprintjs/select'
import {useState, useRef, useCallback} from 'react'
import {openPageInSidebar, reActivateBlock, createPage, renderOverlay} from './common'

import './autocomplete-dialog.css'

interface BookSuggestion {
    key: string;
    title: string;
    authors: string[];
    coverUrl: string | null;
    firstPublishYear: number | null;
    ratingsAverage: number | null;
    numberOfPages: number | null;
    subjects: string[];
    link: string;
}

const BookSuggest = Suggest.ofType<BookSuggestion>()

interface OpenLibraryDoc {
    key: string;
    title: string;
    author_name?: string[];
    first_publish_year?: number;
    cover_i?: number;
    number_of_pages_median?: number;
    subject?: string[];
    ratings_average?: number;
}

const findBooks = async (query: string): Promise<BookSuggestion[]> => {
    const params = new URLSearchParams({q: query, limit: '10'})
    const response = await fetch(`https://openlibrary.org/search.json?${params}`)
    const data = await response.json()
    return parseBooks(data.docs || [])
}

const parseBooks = (docs: OpenLibraryDoc[]): BookSuggestion[] =>
    docs.map(doc => ({
        key: doc.key,
        title: doc.title,
        authors: doc.author_name || [],
        coverUrl: doc.cover_i
            ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-S.jpg`
            : null,
        firstPublishYear: doc.first_publish_year ?? null,
        ratingsAverage: doc.ratings_average ? Math.round(doc.ratings_average * 10) / 10 : null,
        numberOfPages: doc.number_of_pages_median ?? null,
        subjects: (doc.subject || []).slice(0, 5),
        link: `https://openlibrary.org${doc.key}`,
    }))

function createPageForBookAndAuthor(item: BookSuggestion) {
    item.authors.forEach(it =>
        createPage({
            title: it,
            tree: [
                {text: 'isa::[[person]] [[author]]'},
                {text: 'connection::[[public figure]]'},
            ],
        }))

    const mediumCoverUrl = item.coverUrl?.replace('-S.jpg', '-M.jpg')

    return createPage({
        title: item.title,
        tree: [
            ...(mediumCoverUrl ? [{text: `![](${mediumCoverUrl})`}] : []),
            {text: `isa::[[book]]`},
            {text: `author::${item.authors.map(it => `[[${it}]]`).join(' ')}`},
            {text: `link::${item.link}`},
            ...(item.ratingsAverage ? [{text: `averageRating::${item.ratingsAverage}`}] : []),
            ...(item.firstPublishYear ? [{text: `year::${item.firstPublishYear}`}] : []),
            ...(item.numberOfPages ? [{text: `pages::${item.numberOfPages}`}] : []),
            ...(item.subjects.length > 0
                ? [{text: `subjects::${item.subjects.map(s => `[[${s}]]`).join(' ')}`}]
                : []),
        ],
    })
}

export const BookAutocompletePrompt = ({onClose}: { onClose: () => void }) => {

    const [bookSuggestions, setBookSuggestions] = useState<BookSuggestion[]>([])
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const handleQueryChange = useCallback((query: string) => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
        if (query.length < 2) return
        debounceRef.current = setTimeout(async () => {
            setBookSuggestions(await findBooks(query))
        }, 300)
    }, [])

    return (
        <Dialog
            isOpen={true}
            onClose={onClose}
            canEscapeKeyClose
            backdropClassName={'autocomplete-dialog-backdrop'}
            className={'autocomplete-dialog'}
        >
            <div className={Classes.DIALOG_BODY + ' autocomplete-dialog-body'}>

                <h3>Book search</h3>

                <BookSuggest
                    items={bookSuggestions || []}
                    openOnKeyDown={true}
                    popoverProps={{minimal: true}}
                    inputProps={{placeholder: 'Type at least 2 characters to search...'}}
                    noResults={<MenuItem disabled={true} text="No results." />}
                    onQueryChange={handleQueryChange}
                    onItemSelect={(item) => {
                        createPageForBookAndAuthor(item).then(() => openPageInSidebar(item.title))
                        window.navigator.clipboard.writeText(`[[${item.title}]]`)

                        onClose()

                        reActivateBlock()
                    }}
                    inputValueRenderer={(item: BookSuggestion) => item.title}
                    itemRenderer={(item: BookSuggestion, {handleClick, handleFocus, modifiers}) =>
                        <MenuItem
                            key={item.key}
                            disabled={modifiers.disabled}
                            className={modifiers.active ? 'book-suggestion-active' : ''}
                            onClick={handleClick}
                            onFocus={handleFocus}
                            text={
                                <div className="book-suggestion-item">
                                    {item.coverUrl && (
                                        <img
                                            src={item.coverUrl}
                                            alt=""
                                            className="book-suggestion-cover"
                                        />
                                    )}
                                    <div className="book-suggestion-info">
                                        <div className="book-suggestion-title">{item.title}</div>
                                        <div className="book-suggestion-meta">
                                            {item.authors.join(', ')}
                                            {item.firstPublishYear && ` (${item.firstPublishYear})`}
                                            {item.ratingsAverage && ` · ${item.ratingsAverage}/5`}
                                        </div>
                                    </div>
                                </div>
                            }
                        />
                    }
                />
            </div>
        </Dialog>
    )
}

export const showBookAutocomplete = () => renderOverlay(BookAutocompletePrompt)

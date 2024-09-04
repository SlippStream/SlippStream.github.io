export namespace Tidal {
    enum Availability {"STREAM", "DJ", "STEM"}

    type Links = {
        self: string,
        next: string
    }

    type ImageLink = {
        href: string,
        meta: ImageLinkMeta
    }

    type ExternalLink = {
        href: string,
        meta: ExternalLinkMeta
    }

    type ImageLinkMeta = {
        width: number,
        height: number
    }

    type ExternalLinkMeta = {
        type: string
    }

    export type SearchResultRelationship = AlbumAttributes | ArtistAttributes | VideoAttributes | TrackAttributes;

    type AlbumAttributes = {
        title: string,
        barcodeId: string,
        numberOfVolumes: number,
        numberOfItems: number,
        duration: string,
        explicit: boolean,
        releaseDate?: string,
        copyright?: string,
        popularity: number,
        availability?: Availability[],
        mediaTags: string[],
        imageLinks: ImageLink[]
    }

    type TrackAttributes = {
        title: string,
        version?: string,
        isrc: string,
        duration: string,
        copyright?: string,
        explicit: boolean,
        popularity: number,
        availability?: Availability[],
        mediaTags: string[],
        externalLinks?: ExternalLink[]
    }

    type VideoAttributes = {
        title: string,
        version?: string,
        isrc: string,
        duration: string,
        copyright?: string,
        releaseDate?: string,
        explicit: boolean,
        availability?: Availability[],
        imageLinks?: ImageLink[],
        externalLinks?: ExternalLink[]
    }

    type ArtistAttributes = {
        name: string,
        popularity: number,
        imageLinks: ImageLink[]
        externalLinks: ExternalLink[]
    }

    type ResourceIdentifier = {
        id: string,
        type: string
    }

    type Relationship = {
        data: ResourceIdentifier[],
        links: Links
    }

    export type SearchResultRelationshipResource = {
        attributes: SearchResultRelationship,
        relationships: {
            albums?: Relationship,
            artists?: Relationship,
            tracks?: Relationship,
            videos?: Relationship,
        },
        links: Links,
        id: string,
        type: string
    }

    export type SearchResultsRelationshipsDocument = {
        data: ResourceIdentifier[],
        links: Links,
        included: SearchResultRelationshipResource[]
    }
}
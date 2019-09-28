export interface Links {
        self: Link,
        html: Link,
        issue: Link
        comments: Link,
        review_comments: Link,
        review_comment: Link,
        commits: Link,
        statuses: Link,
}

export interface Link {
    href: string
}
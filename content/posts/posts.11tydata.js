module.exports = {
    eleventyComputed: {
        permalink: (data) => `/pages/${data.category}/${data.slug}.html`,
        structuredDataJson: (data) => JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: data.title,
            description: data.description,
            author: { '@type': 'Person', name: data.author || 'Clinton | Tzeptosoft' },
            datePublished: new Date(data.date).toISOString(),
            image: data.coverImage ? `https://tzeptosoft.com${data.coverImage}` : undefined,
            mainEntityOfPage: `https://tzeptosoft.com/pages/${data.category}/${data.slug}.html`
        })
    }
};
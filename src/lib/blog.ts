/**
 * Journal content model (Shopify-like blog).
 *
 * A single source of truth used by:
 * - homepage journal section
 * - /blog index
 * - /blog/[slug] article pages
 */

export interface BlogAuthor {
	name: string;
	role: string;
}

export interface BlogBlock {
	heading?: string;
	paragraphs: string[];
	bullets?: string[];
}

export interface BlogPost {
	slug: string;
	title: string;
	excerpt: string;
	image: string;
	publishedAt: string;
	author: BlogAuthor;
	tags: string[];
	readMinutes: number;
	content: BlogBlock[];
}

export interface BlogPostSummary {
	slug: string;
	title: string;
	excerpt: string;
	image: string;
	href: string;
	date: string;
	author: string;
	readMinutes: number;
	tags: string[];
}

const posts: BlogPost[] = [
	{
		slug: 'how-to-build-a-capsule-wardrobe',
		title: 'How to Build a Capsule Wardrobe',
		excerpt: 'Five practical rules to buy less, style faster and keep every look coherent.',
		image: 'https://picsum.photos/seed/post1/1200/780',
		publishedAt: '2026-05-16',
		author: { name: 'Elena Rossi', role: 'Style Editor' },
		tags: ['Guides', 'Styling'],
		readMinutes: 6,
		content: [
			{
				heading: 'Start from your weekly reality',
				paragraphs: [
					'Most wardrobes fail because they are planned for fantasy days, not real ones. Start by listing what you actually wear Monday through Sunday.',
					'Once your weekly rhythm is clear, build categories around it: outerwear, knitwear, shirts, trousers, denim and shoes.',
				],
			},
			{
				heading: 'Define a strict color base',
				paragraphs: [
					'A Dawn-like palette works because it is easy to combine: black, white, off-white and grey as core colors, with one accent at most.',
					'This keeps every new purchase compatible with what you already own.',
				],
				bullets: [
					'Choose 2 dominant neutrals',
					'Add 1 support neutral',
					'Limit strong colors to accessories',
				],
			},
			{
				heading: 'Buy by outfit, not by product',
				paragraphs: [
					'Before checkout, test if the item creates at least three complete outfits with pieces you already own.',
					'If not, it is likely an impulse buy disguised as a wardrobe essential.',
				],
			},
		],
	},
	{
		slug: 'caring-for-natural-fibres',
		title: 'Caring for Natural Fibres',
		excerpt:
			'Simple care routines that keep linen, wool and cotton looking premium season after season.',
		image: 'https://picsum.photos/seed/post2/1200/780',
		publishedAt: '2026-04-21',
		author: { name: 'Marco Bellini', role: 'Product Specialist' },
		tags: ['Care', 'Materials'],
		readMinutes: 5,
		content: [
			{
				heading: 'Wash less, air more',
				paragraphs: [
					'Frequent washing breaks down fibers faster than wear itself. Airing garments and spot-cleaning extends their life considerably.',
					'Natural fibers recover shape better when they are rested between wears.',
				],
			},
			{
				heading: 'Use lower temperatures',
				paragraphs: [
					'Cold or low-temperature cycles are enough for most garments and preserve color depth.',
					'Avoid aggressive spin settings for wool and fine knits.',
				],
				bullets: [
					'Linen: cool wash, hang dry',
					'Wool: gentle cycle or hand wash',
					'Cotton: cool wash, medium spin',
				],
			},
			{
				heading: 'Store for structure',
				paragraphs: [
					'Fold heavy knitwear to avoid shoulder distortion. Use broad hangers for tailoring and coats.',
					'Add cedar blocks in storage to protect natural fibers without chemical odors.',
				],
			},
		],
	},
	{
		slug: 'inside-our-atelier',
		title: 'Inside Our Atelier',
		excerpt: 'A closer look at the small production flow behind every collection drop.',
		image: 'https://picsum.photos/seed/post3/1200/780',
		publishedAt: '2026-03-11',
		author: { name: 'Sofia Leone', role: 'Brand Director' },
		tags: ['Behind the Scenes', 'Production'],
		readMinutes: 7,
		content: [
			{
				heading: 'Small batches by design',
				paragraphs: [
					'We produce in limited runs to keep quality checks tighter and avoid overstock.',
					'This process also allows faster iteration on fit and finishing details.',
				],
			},
			{
				heading: 'Quality checkpoints',
				paragraphs: [
					'Every piece goes through three checks: construction, finishing and final visual review.',
					'Any defect loops back before shipping, not after customer feedback.',
				],
				bullets: ['Seam stress test', 'Color consistency check', 'Hardware and trim verification'],
			},
			{
				heading: 'Long-term supplier partnerships',
				paragraphs: [
					'Working with a small supplier network gives us better consistency and transparent communication.',
					'It also means we can improve products season after season rather than rebuilding processes each time.',
				],
			},
		],
	},
	{
		slug: 'spring-layering-playbook',
		title: 'The Spring Layering Playbook',
		excerpt: 'A practical layering formula for transitional weather and cleaner silhouettes.',
		image: 'https://picsum.photos/seed/post4/1200/780',
		publishedAt: '2026-02-17',
		author: { name: 'Elena Rossi', role: 'Style Editor' },
		tags: ['Guides', 'Seasonal'],
		readMinutes: 4,
		content: [
			{
				heading: 'Use three functional layers',
				paragraphs: [
					'Base layer for comfort, mid layer for texture, outer layer for protection. This keeps flexibility without visual bulk.',
					'The cleanest combinations start with lightweight fabrics and build upward.',
				],
			},
			{
				heading: 'Balance proportions',
				paragraphs: [
					'If the outer layer is oversized, keep the mid-layer close to the body. If the trousers are wide, choose a shorter jacket.',
					'Contrast in silhouette makes each layer intentional instead of accidental.',
				],
			},
		],
	},
];

export const formatBlogDate = (value: string): string =>
	new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	}).format(new Date(value));

const toSummary = (post: BlogPost): BlogPostSummary => ({
	slug: post.slug,
	title: post.title,
	excerpt: post.excerpt,
	image: post.image,
	href: `/blog/${post.slug}`,
	date: formatBlogDate(post.publishedAt),
	author: post.author.name,
	readMinutes: post.readMinutes,
	tags: post.tags,
});

export const getBlogPosts = (): BlogPost[] =>
	[...posts].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));

export const getBlogPostBySlug = (slug: string): BlogPost | undefined =>
	getBlogPosts().find((post) => post.slug === slug);

export const getBlogTags = (): string[] =>
	[...new Set(getBlogPosts().flatMap((post) => post.tags))].sort((a, b) => a.localeCompare(b));

export const getLatestBlogSummaries = (limit = 3): BlogPostSummary[] =>
	getBlogPosts().slice(0, limit).map(toSummary);

export const getBlogSummaries = (): BlogPostSummary[] => getBlogPosts().map(toSummary);

export const getRelatedBlogSummaries = (slug: string, limit = 3): BlogPostSummary[] => {
	const current = getBlogPostBySlug(slug);
	if (!current) return [];

	const postsByScore = getBlogPosts()
		.filter((post) => post.slug !== slug)
		.map((post) => {
			const shared = post.tags.filter((tag) => current.tags.includes(tag)).length;
			return { post, score: shared };
		})
		.sort((a, b) => b.score - a.score);

	return postsByScore.slice(0, limit).map((item) => toSummary(item.post));
};

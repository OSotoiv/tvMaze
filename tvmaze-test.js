describe("tvmaze API search", () => {
    beforeEach(() => {
        $('#search-query').val('batman');
    });
    it('search api and return array of obj shows', async () => {
        const term = $("#search-query").val();
        console.log('term is', term);
        const shows = await getShowsByTerm(term);
        console.log(shows)
        expect(shows.length).toBe(10);
        expect(shows.every(({ show }) => show.name)).toBe(true);
        expect(shows.every(({ show }) => show.id)).toBe(true);
    });
    afterEach(function () {
        $('#episodes-list').empty();
    });
})
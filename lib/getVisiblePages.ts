export const getVisiblePages = (currentPage: number, totalPages: number, delta: number = 4, mobile: boolean = true) => {
    let pages = [];
    let start = Math.max(1, currentPage - delta);
    let end = Math.min(currentPage + delta, totalPages);
    let temp = []

    if (delta >= 2 && totalPages < 10) {
        const pages =   Array.from(
            { length: 9 },
            (_, i) => 1 + i,
        );
        pages.length = totalPages;
        return pages;
    }

    if (start > end - delta * 2) {
        start = (end - 2 * delta);

        if (start <= 0) {
            let counter = start;
            do {
                counter++;
                temp.push('x');
            } while (counter < 1);
            start = 1;
        }
    }

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (temp.length > 0) {
        temp.forEach(p => pages.push(pages.length + 1));
    }

    if (pages.length > totalPages) {
        pages.length = totalPages;
    }

    if (mobile) {
        return pages;
    }

    // Left scope
    if (pages[0] > 1) {
        if (pages[1] > 2) {
            if (currentPage - delta <= 3) {
                if (currentPage - delta === 3) {
                    pages.unshift(2);
                }     
            } else {
                pages.unshift(0);
            }
        }
        pages.unshift(1);
    } 

    // Right scope
    if (pages[pages.length - 1] < totalPages) {
        if (pages[pages.length - 1] < totalPages - 1) {
            if (totalPages - pages[pages.length - 1] === 2){
                pages.push(totalPages -1)
            } else {
                pages.push(0);
            }
        }
        pages.push(totalPages);
    }

    return pages;
}
const scraperObject = {
    url: 'https://github.com/selego',
    async scraper(browser) {
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url);
        
        const signupButton = "a.HeaderMenu-link.d-inline-flex";
        await page.waitForSelector(signupButton);
        await page.click(signupButton);
        
        const loginSelector = ".form-control.input-block.js-login-field";
        const loginText = "BaptisteSelego";
        await page.waitForSelector(loginSelector);
        await page.type(loginSelector, loginText);
    
        const mdpSelector = ".form-control.input-block.js-password-field";
        const mdpText = "Francois-2001";
        await page.waitForSelector(mdpSelector);
        await page.type(mdpSelector, mdpText);

        const nextButton = 'input[type="submit"][name="commit"][value="Sign in"].btn.btn-primary.btn-block.js-sign-in-button';
        await page.waitForSelector(nextButton);
        await page.click(nextButton);

        const linkSelector = 'a[href="/orgs/selego/repositories?type=all"].Link--muted.text-bold';
        await page.waitForSelector(linkSelector);
        await page.click(linkSelector);

        const tableUlSelector = 'ul.Box-sc-g0xbh4-0.juhHRu.list-view-items';
        await page.waitForSelector(tableUlSelector);
        console.log('Element is found');
        let allData = []; // Pour stocker toutes les données extraites
        let hasNext = true;

    while (hasNext) {
        // Extraire les données de la page
        const data = await page.evaluate(() => {
            const containerElements = document.querySelectorAll('li.Box-sc-g0xbh4-0.gyJCsj.list-view-item');
            const extractedData = Array.from(containerElements).map(container => {
                const projectElement = container.querySelector('span');
                const project = projectElement ? projectElement.textContent : 'N/A';
                const linkElement = container.querySelector('a.Link__StyledLink-sc-14289xe-0.iPboZF[data-testid="listitem-title-link"]');
                const link = linkElement ? linkElement.href : 'N/A';
                return {
                    project: project,
                    link: link,
                };
            });
        
            const nextElement = document.querySelector('a[rel="next"][aria-label="Next Page"].Pagination__Page-sc-cp45c9-0.eyvndq');
            const hasNext = !!nextElement;
        
            return { extractedData, hasNext };
        });
        
        console.log('Extracted Data:', data.extractedData);
        allData = allData.concat(data.extractedData);
        hasNext = data.hasNext;

        // Si l'élément "Next" est présent, cliquer dessus
        hasNext = data.hasNext;
        if (hasNext) {
            await page.evaluate(() => {
                const nextElement = document.querySelector('a[rel="next"][aria-label="Next Page"].Pagination__Page-sc-cp45c9-0.eyvndq');
                if (nextElement) {
                    console.log('Element found:', nextElement);
                    nextElement.click();
                }
            });

            // Attendre que la page se charge après le clic
            await new Promise(resolve => setTimeout(resolve, 1000));// Attendre 2 secondes pour que la page se charge
        }
    }


        async function findAndClickElement(page, textChoices) {
            return await page.evaluate((textChoices) => {
                const anchorElements = document.querySelectorAll('a.Link--primary');
                for (let i = 0; i < textChoices.length; i++) {
                    const textChoice = textChoices[i];
                    for (let j = 0; j < anchorElements.length; j++) {
                        const anchor = anchorElements[j];
                        if (anchor.textContent.trim() === textChoice) {
                            console.log('Element is found with text:', textChoice);
                            anchor.click();
                            return { found: true, text: textChoice };
                        }
                    }
                }
                return { found: false };
            }, textChoices);
        }

        for (let item of allData) {
            try {
                const newPage = await browser.newPage();
                await newPage.goto(item.link, { waitUntil: 'networkidle2' });
                console.log(`Navigating to ${item.project   }...`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                console.log('Waiting for 2 seconds');
                
                const elementFound = await findAndClickElement(newPage, ['third-parties','services','src','api']);

                if (elementFound.found) {
                    console.log('Clicked on element with text:', elementFound.text);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    console.log('Waiting for 2 seconds');
                
                    const elementFound1 = await findAndClickElement(newPage, ['third-parties','services','src','api']);
                    if (elementFound1.found) {
                        console.log('Clicked on element with text:', elementFound1.text);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        console.log('Waiting for 2 seconds');
                
                        const elementFound2 = await findAndClickElement(newPage, ['third-parties','services','src','api']);
                        if (elementFound2.found) {
                            console.log('Clicked on element with text:', elementFound2.text);
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            console.log('Waiting for 2 seconds');
                    
                            const elementFound3 = await findAndClickElement(newPage, ['third-parties','services','src','api']);
                            console.log('on scrappe', elementFound3.text);
                            const nomfiles = await newPage.evaluate(() => {
                                // Sélectionner tous les éléments <a> à l'intérieur du <tbody>
                                const links = document.querySelectorAll('tbody a');
                            
                                // Extraire les attributs title qui se terminent par '.js'
                                const titles = Array.from(links)
                                    .map(link => link.getAttribute('title'))
                                    .filter(title => title && title.endsWith('.js'));
                            
                                // Créer un ensemble pour éliminer les doublons
                                const uniqueTitles = Array.from(new Set(titles));
                            
                                // Retourner les titres uniques comme une chaîne séparée par des virgules
                                return uniqueTitles.join(', ');
                            });
                            item.files = nomfiles;
                            
                        }
                        else {
                            console.log('No element with the specified text values is found.');
                            console.log('On scrappe');
                            const nomfiles = await newPage.evaluate(() => {
                                // Sélectionner tous les éléments <a> à l'intérieur du <tbody>
                                const links = document.querySelectorAll('tbody a');
                            
                                // Extraire les attributs title qui se terminent par '.js'
                                const titles = Array.from(links)
                                    .map(link => link.getAttribute('title'))
                                    .filter(title => title && (title.endsWith('.js') || title.endsWith('.ts')));
                            
                                // Créer un ensemble pour éliminer les doublons
                                const uniqueTitles = Array.from(new Set(titles));
                            
                                // Retourner les titres uniques comme une chaîne séparée par des virgules
                                return uniqueTitles.join(', ');
                            });
                            
                            // Ajouter les titres de fichiers à l'objet item
                            item.files = nomfiles;
                        }
                        
                    }
                    else {
                        console.log('No element with the specified text values is found.');
                        console.log('On scrappe');
                            const nomfiles = await newPage.evaluate(() => {
                                // Sélectionner tous les éléments <a> à l'intérieur du <tbody>
                                const links = document.querySelectorAll('tbody a');
                            
                                // Extraire les attributs title qui se terminent par '.js'
                                const titles = Array.from(links)
                                    .map(link => link.getAttribute('title'))
                                    .filter(title => title && (title.endsWith('.js') || title.endsWith('.ts')));
                            
                                // Créer un ensemble pour éliminer les doublons
                                const uniqueTitles = Array.from(new Set(titles));
                            
                                // Retourner les titres uniques comme une chaîne séparée par des virgules
                                return uniqueTitles.join(', ');
                            });
                            
                            // Ajouter les titres de fichiers à l'objet item
                            item.files = nomfiles;
                    }
                } else {
                    console.log('No element with the specified text values is found.');
                    console.log('On scrappe');
                            const nomfiles = await newPage.evaluate(() => {
                                // Sélectionner tous les éléments <a> à l'intérieur du <tbody>
                                const links = document.querySelectorAll('tbody a');
                            
                                // Extraire les attributs title qui se terminent par '.js'
                                const titles = Array.from(links)
                                    .map(link => link.getAttribute('title'))
                                    .filter(title => title && (title.endsWith('.js') || title.endsWith('.ts')));
                            
                                // Créer un ensemble pour éliminer les doublons
                                const uniqueTitles = Array.from(new Set(titles));
                            
                                // Retourner les titres uniques comme une chaîne séparée par des virgules
                                return uniqueTitles.join(', ');
                            });
                            
                            // Ajouter les titres de fichiers à l'objet item
                            item.files = nomfiles;
                }


                await newPage.close();
            } catch (error) {
                console.error(`Failed to open ${item.link}: ${error.message}`);
                item.email = 'NA';
            }
        }
        return allData;
    }
};

module.exports = scraperObject;

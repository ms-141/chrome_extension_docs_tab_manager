const tabs = await chrome.tabs.query({
    url: [
        "https://developer.chrome.com/docs/webstore/*",
        "https://developer.chrome.com/docs/extensions/*",
    ]
});

//compares international languages for the tab title
const collator = new Intl.Collator();
//sort all the tab titles according to the alphabetical order using out collator
tabs.sort((a, b) => collator.compare(a.title, b.title));

//made a template that is based on the li_template element in the html file
const template = document.getElementById("li_template");
//making a new Set
const elements = new Set();
//looping over the tabs with a for of loop
for (const tab of tabs) {
    //making an element variable that is the first child element in the template variable (which is a list in the html file)
    const element = template.content.firstElementChild.cloneNode(true);
    //creating a title that is from the tabs object, split at the dash
    const title = tab.title.split("-")[0].trim();
    //make a new URL pathname starting at /docs
    const pathname = new URL(tab.url).pathname.slice("/docs".length);

    //placing our title in the .title
    element.querySelector(".title").textContent = title;
    //placing the current iteration of the .pathname to pathname
    element.querySelector(".pathname").textContent = pathname;
    //placing the current iteration of the a based on a click
    element.querySelector("a").addEventListener("click", async () => {
        // need to focus window as well as the active tab
        await chrome.tabs.update(tab.id, { active: true });//brings the window to the front
        await chrome.windows.update(tab.windowId, { focused: true });
    });

    //then add that element to the elements set
    elements.add(element);
}
//find 'ul' in the html and add the elements as an array using the spread operator
document.querySelector("ul").append(...elements);

const button = document.querySelector("button"); //find the button in the html page and make it equal to this button variable in the js code
//when someone clicks the button,
button.addEventListener("click", async () => {
    const tabIds = tabs.map(({ id }) => id);
    if (tabIds.length) {
        const group = await chrome.tabs.group({ tabIds });
        await chrome.tabGroups.update(group, { title: "DOCS" });
    }
});
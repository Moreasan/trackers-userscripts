export const insertBefore = (
  newNode: HTMLElement,
  existingNode: HTMLElement
) => {
  existingNode.parentNode!!.insertBefore(newNode, existingNode);
};

export const insertAfter = (
  newNode: HTMLElement,
  existingNode: HTMLElement
) => {
  existingNode.parentNode!!.insertBefore(newNode, existingNode.nextSibling);
};

export const addChild = (parent: HTMLElement, child: HTMLElement) => {
  parent.appendChild(child);
};

export const appendErrorMessage = () => {
  const div = document.createElement("div");
  div.innerHTML =
    '<span style="margin-left:15px;color:white;font-weight:bold;float:right;font-size:22px;line-height:20px;cursor:pointer;transition:0.3s;\n" onclick="this.parentElement.style.display=\'none\';">&times;</span>' +
    '<span id="message"></span>';
  div.style.position = "fixed";
  div.style.bottom = "50px";
  div.style.left = "50%";
  div.style.display = "none";
  div.style.width = "50%";
  div.style.padding = "20px";
  div.style.transform = "translate(-50%, 0)";
  div.style.backgroundColor = "#f44336";
  div.style.color = "white";

  addChild(document.body, div);
};

export const showError = (message: string) => {
  const element = document.querySelector("#message")! as HTMLElement;
  element.innerHTML = "Error occurred in Fin Unique titles script: " + message;
  element.parentElement!.style.display = "block";
};

export const findFirst = (element: Element, ...selectors: string[]) => {
  for (let selector of selectors) {
    let elements = element.querySelectorAll(selector);
    if (elements.length > 0) {
      return elements;
    }
  }
  return null;
};

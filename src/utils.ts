export function openSidebar() {
  if (typeof window !== 'undefined') {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.setProperty('--SideNavigation-slideIn', '1');
  }
}

export function closeSidebar() {
  if (typeof window !== 'undefined') {
    document.documentElement.style.removeProperty('--SideNavigation-slideIn');
    document.body.style.removeProperty('overflow');
  }
}

export function toggleSidebar() {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const slideIn = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue('--SideNavigation-slideIn');
    if (slideIn) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }
}

export function openMessagesPane() {
  if (typeof window !== 'undefined') {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.setProperty('--MessagesPane-slideIn', '1');
  }
}

export function closeMessagesPane() {
  if (typeof window !== 'undefined') {
    document.documentElement.style.removeProperty('--MessagesPane-slideIn');
    document.body.style.removeProperty('overflow');
  }
}

export function toggleMessagesPane() {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const slideIn = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue('--MessagesPane-slideIn');
    if (slideIn) {
      closeMessagesPane();
    } else {
      openMessagesPane();
    }
  }
}

export function formatDateTimeString(dateTimeStr: string): string {

  // Parse the date time string into a Date object
  let date = new Date(dateTimeStr);

  // Format the date and time
  let year = date.getUTCFullYear();
  let month = ("0" + (date.getUTCMonth() + 1)).slice(-2); // Months are 0-based in JS
  let day = ("0" + date.getUTCDate()).slice(-2);
  let hour = ("0" + date.getUTCHours()).slice(-2);
  let minute = ("0" + date.getUTCMinutes()).slice(-2);

  // Construct the formatted date time string
  let formattedDateTime = `${year}-${month}-${day} ${hour}:${minute}`;

  return formattedDateTime;

}

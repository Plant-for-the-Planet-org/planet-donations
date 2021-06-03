export function getFilteredProjects(projects: Array<any>, type: string) {
  if (type === "featured") {
    return projects.filter(
      (project: { properties: { isFeatured: boolean } }) =>
        project.properties.isFeatured === true
    );
  } else if (type === "all") {
    return projects;
  }
}

export function getSearchProjects(projects: Array<any>, keyword: string) {
  let resultProjects = [];
  if (keyword !== "") {
    const keywords = keyword.split(/[\s\-.,+]+/);
    resultProjects = projects.filter(function (project) {
      const found = keywords.every(function (word) {
        const searchWord = word
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();
        const projectName = project.properties.name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();
        const projectLocation = project.properties.location
          ? project.properties.location
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
          : "";
        const projectTpoName = project.properties.tpo.name
          ? project.properties.tpo.name
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
          : "";
        // const projectCountry = project.properties.country
        //   ? t("country:" + project.properties.country.toLowerCase())
        //       .normalize("NFD")
        //       .replace(/[\u0300-\u036f]/g, "")
        //       .toLowerCase()
        //   : "";
        //searching for name
        return (
          projectName.indexOf(searchWord) > -1 ||
          //searching for location
          (projectLocation && projectLocation.indexOf(searchWord) > -1) ||
          //searching for tpo name
          (projectTpoName && projectTpoName.indexOf(searchWord) > -1)
          //searching for country name
          // (projectCountry && projectCountry.indexOf(searchWord) > -1)
        );
      });
      return found;
    });
    return resultProjects;
  } else {
    return projects;
  }
}

export function getRandomProjects(arr:Array<any>, n:number) {
  var result = new Array(n),
      len = arr.length,
      taken = new Array(len);
  if (n > len)
      throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
      var x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}
import { Breadcrumb } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import React from "react";

export const BreadCrumbs = ({ pageList }) => {
  const navigate = useNavigate();
  return (
    <Breadcrumb.Root px="13px">
      <Breadcrumb.List>
        {pageList.map((page, index) => (
          <React.Fragment key={index}>
            <Breadcrumb.Item >
              <Breadcrumb.Link
                onClick={() =>
                  navigate(page.path, {
                    state: {
                      breadcrumbs: pageList.slice(0, index + 1),
                      fromLabel: pageList[0]?.name ?? "Main Page",
                      fromPath: pageList[0]?.path ?? "/",
                      mealName:
                        pageList.find((p) => p.path.startsWith("/meal"))
                          ?.name ?? "Meal",
                      mealPath:
                        pageList.find((p) => p.path.startsWith("/meal"))
                          ?.path ?? "/meal",
                    },
                  })
                }
              >
                {page.name}
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            {index < pageList.length - 1 && <Breadcrumb.Separator />}
          </React.Fragment>
        ))}
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
};

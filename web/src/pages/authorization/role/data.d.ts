//table
export type TableListItem = {
    createdAt: string;
    description: string;
    hospitalIds: string;
    id: number;
    menuIds: number[] | string;
    menuNames: string;
    name: string;
    rowStatus: boolean;
    sequence: number;
    updatedAt: string;
    updatedBy: number;
    visibilityType: number;
    visibilityIds: string | number[];
};

export type MenuList = {
    children: MenuList[]
    component: string;
    createdAt: string;
    icon: string;
    id: number;
    key: number;
    name: string;
    parentId: number;
    path: string;
    rowStatus: boolean;
    sequence: number;
    updatedAt: string;
};

export type MenuTreeProp = {
    title: string;
    value: number;
    children?: MenuTreeProp[];
};

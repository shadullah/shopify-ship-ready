import React, { useState, useCallback, useEffect } from "react";
import {
  IndexTable,
  Card,
  useIndexResourceState,
  Text,
  Badge,
  useBreakpoints,
  Banner,
  Button,
  InlineStack,
  Pagination,
} from "@shopify/polaris";
import { useNavigate, useSearchParams } from "@remix-run/react";
import { EditIcon, DeleteIcon } from "@shopify/polaris-icons";
import { Modal, TitleBar } from "@shopify/app-bridge-react";
import { useSubmit } from "@remix-run/react";

const ReadyTable = ({
  data,
  resourceName = { singular: "item", plural: "items" },
  headings,
  selectable = true,
  pagination = false,
  actions = false,
}) => {
  const navigate = useNavigate();
  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const [cursorHistory, setCursorHistory] = useState([]);
  const [currentCursorIndex, setCurrentCursorIndex] = useState(-1);
  const [selectedObject, setSelectedObject] = useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  useEffect(() => {
    const cursor = searchParams.get("cursor");
    if (cursor && !cursorHistory.includes(cursor)) {
      setCursorHistory((prev) => [...prev, cursor]);
      setCurrentCursorIndex((prev) => prev + 1);
    }
  }, [searchParams]);

  if (!data || !data.nodes || data.nodes.length === 0) {
    return (
        <Banner tone="info">
          <p>
            No data available or invalid data format. Please provide an array of
            items.
          </p>
        </Banner>
    );
  }

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(data.nodes);

  const tableHeadings =
    headings || Object.keys(data.nodes[0]).map((key) => ({ title: key }));

  const renderCell = (item, heading) => {
    const key = heading.title
      .trim()
      .replace(/\s+/g, "_")
      .toLowerCase();
    const value = item[key];

    if (key === "status" || key === "isactive" || key === "isActive" || key === "active") {
      const isActive = String(value).toLowerCase() == "true" || value == "published";
      return (
        <Badge progress={isActive ? "complete" : "incomplete"} tone={isActive ? "success" : "info"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    }
    if (key == "created_at" || key == "date" || key == "createdAt") {
      console.log("value", value);
      return value
        ? new Date(value).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "N/A";
    }
    return value ?? "N/A";
  };

  const handlePagination = useCallback(
    (direction) => {
      if (direction === "next" && data?.pageInfo?.hasNextPage) {
        const newCursor = data.pageInfo.endCursor;
        setCursorHistory((prev) => [
          ...prev.slice(0, currentCursorIndex + 1),
          newCursor,
        ]);
        setCurrentCursorIndex((prev) => prev + 1);
        navigate(`?cursor=${newCursor}`);
      } else if (direction === "previous" && data?.pageInfo?.hasPreviousPage) {
        const newIndex = currentCursorIndex - 1;
        setCurrentCursorIndex(newIndex);
        const cursor = cursorHistory[newIndex] || "";
        navigate(`?cursor=${cursor}`);
      }
    },
    [data.pageInfo, navigate, cursorHistory, currentCursorIndex],
  );

  const handleDelete = (id) => {
    // console.log("Deleting item with id:", id);
    submit(
      {
        objectId: id,
        deleteObject: true,
      },
      { method: "post", encType: "application/json" },
    );
    setOpenDeleteModal(false);
  };

  const rowMarkup = data.nodes.map((item, index) => (
    <IndexTable.Row
      id={item.id || index.toString()}
      key={item.id || index.toString()}
      selected={
        selectable && selectedResources.includes(item.id || index.toString())
      }
      position={index}
    >
      {tableHeadings.map((heading, cellIndex) => (
        <IndexTable.Cell key={cellIndex}>
          {cellIndex === tableHeadings.length - 1 && actions ? (
            <InlineStack gap={200}>
              <Button variant="plain" 
                url={`/app/${resourceName.handle}/edit/${item.id.split('/').pop() }`}
                icon={EditIcon}>
                Edit
              </Button>
              <Button
                variant="plain"
                tone="critical"
                onClick={() => {
                  setSelectedObject({ id: item.id || index.toString() });
                  setOpenDeleteModal(true);
                }}
                icon={DeleteIcon}
              >
                Delete
              </Button>
            </InlineStack>
          ) : cellIndex === 0 ? (
            <Text variant="bodyMd" fontWeight="bold" as="span">
              {renderCell(item, heading)}
            </Text>
          ) : (
            renderCell(item, heading)
          )}
        </IndexTable.Cell>
      ))}
    </IndexTable.Row>
  ));

  return (
    <Card padding={0}>
      <IndexTable
        condensed={useBreakpoints().smDown}
        resourceName={resourceName}
        itemCount={data.nodes.length}
        selectedItemsCount={
          selectable
            ? allResourcesSelected
              ? "All"
              : selectedResources.length
            : undefined
        }
        onSelectionChange={selectable ? handleSelectionChange : undefined}
        headings={tableHeadings}
        selectable={selectable}
      >
        {rowMarkup}
      </IndexTable>

      <Modal id="deleteModal" open={openDeleteModal}>
        <div
          style={{
            padding: "14px",
          }}
        >
          <p>Are you sure you want to delete this item?</p>
        </div>
        <TitleBar>
          <button
            variant="primary"
            onClick={() => handleDelete(selectedObject.id)}
            tone="critical"
          >
            Confirm delete
          </button>
          <button onClick={() => setOpenDeleteModal(false)}>Cancel</button>
        </TitleBar>
      </Modal>

      {pagination &&
        (data?.pageInfo?.hasNextPage || data?.pageInfo?.hasPreviousPage) && (
          <div
            style={{
              padding: "10px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Pagination
              hasPrevious={data?.pageInfo?.hasPreviousPage}
              onPrevious={() => handlePagination("previous")}
              hasNext={data?.pageInfo?.hasNextPage}
              onNext={() => handlePagination("next")}
            />
          </div>
        )}
    </Card>
  );
};

export default ReadyTable;

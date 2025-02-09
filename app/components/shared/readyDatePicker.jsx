import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Popover, TextField, Card, DatePicker, Icon } from '@shopify/polaris';
import { CalendarIcon } from '@shopify/polaris-icons';

const ReadyDatePicker = ({ date, setDate, label = "Select date" }) => {
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(date ? new Date(date) : new Date());
  const [{ month, year }, setDisplayDate] = useState({
    month: selectedDate.getMonth(),
    year: selectedDate.getFullYear(),
  });

  const datePickerRef = useRef(null);

  const handleInputValueChange = useCallback((value) => {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      setSelectedDate(date);
      setDate(date.toISOString().split('T')[0]);
    }
  }, [setDate]);

  const handleOnClose = useCallback(() => {
    setVisible(false);
  }, []);

  const handleMonthChange = useCallback((month, year) => {
    setDisplayDate({ month, year });
  }, []);

  const handleDateSelection = useCallback(({ start: newSelectedDate }) => {
    setSelectedDate(newSelectedDate);
    setDate(newSelectedDate.toISOString().split('T')[0]);
    setVisible(false);
  }, [setDate]);

  useEffect(() => {
    if (selectedDate) {
      setDisplayDate({
        month: selectedDate.getMonth(),
        year: selectedDate.getFullYear(),
      });
    }
  }, [selectedDate]);

  return (
    <Popover
      active={visible}
      autofocusTarget="none"
      preferredAlignment="left"
      fullWidth
      preferInputActivator={false}
      preferredPosition="below"
      preventCloseOnChildOverlayClick
      onClose={handleOnClose}
      activator={
        <TextField
          label={label}
          prefix={<Icon source={CalendarIcon} />}
          value={selectedDate.toISOString().split('T')[0]}
          onFocus={() => setVisible(true)}
          onChange={handleInputValueChange}
          autoComplete="off"
        />
      }
    >
      <Card ref={datePickerRef}>
        <DatePicker
          month={month}
          year={year}
          selected={selectedDate}
          onMonthChange={handleMonthChange}
          onChange={handleDateSelection}
        />
      </Card>
    </Popover>
  );
};

export default ReadyDatePicker;
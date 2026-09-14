const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8001";

// ============================================================
// PRODUCTION TYPES
// ============================================================

export type ProductionStatus =
  | "Completed"
  | "In Progress"
  | "Delayed";

export type ProductionShift =
  | "Day Shift"
  | "Night Shift";

export type ProductionRecord = {
  id: number;
  date: string;
  shift: ProductionShift;
  extracted: number;
  processed: number;
  output: number;
  operatingHours: number;
  downtime: number;
  status: ProductionStatus;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductionRecordPayload = {
  date: string;
  shift: ProductionShift;
  extracted: number;
  processed: number;
  output: number;
  operatingHours: number;
  downtime: number;
  status: ProductionStatus;
  notes?: string | null;
};

export type ProductionSummary = {
  totalExtracted: number;
  totalProcessed: number;
  totalOutput: number;
  totalOperatingHours: number;
  totalDowntime: number;
  processingEfficiency: number;
  operatingEfficiency: number;
  completedRecords: number;
  inProgressRecords: number;
  delayedRecords: number;
};

export type ProductionChartPoint = {
  day: string;
  date: string;
  extracted: number;
  processed: number;
  output: number;
};

// ============================================================
// PRODUCTION TARGET TYPES
// ============================================================

export type ProductionTarget = {
  id: number;
  date: string;
  target: number;
  createdAt: string;
  updatedAt: string;
};

export type ProductionTargetPayload = {
  target_date: string;
  target_output: number;
};

export type ProductionTargetProgress = {
  targetDate: string;
  targetOutput: number;
  actualOutput: number;
  remainingOutput: number;
  progressPercentage: number;
};

// ============================================================
// OPERATIONAL ISSUE TYPES
// ============================================================

export type OperationalIssue = {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  duration: string;
  durationMinutes?: number | null;
  status: "Active" | "Resolved";
  createdAt?: string;
  updatedAt?: string;
};

export type OperationalIssuePayload = {
  title: string;
  description?: string | null;
  category: string;
  priority: "High" | "Medium" | "Low";
  durationMinutes?: number | null;
  status: "Active" | "Resolved";
};

// ============================================================
// SHIFT TYPES
// ============================================================

export type ShiftStatus =
  | "Upcoming"
  | "Active"
  | "Completed";

export type MineShift = {
  id: number;
  date: string;
  shift: string;
  status: ShiftStatus;
  supervisor: string;
  startTime: string;
  endTime: string;
  workers: number;
  production: number;
  operatingHours: number;
  downtime: number;
};

export type MineShiftPayload = {
  date: string;
  shift: string;
  status: ShiftStatus;
  supervisor: string;
  startTime: string;
  endTime: string;
  workers: number;
};

export type MineShiftUpdatePayload = {
  date?: string;
  shift?: string;
  status?: ShiftStatus;
  supervisor?: string;
  startTime?: string;
  endTime?: string;
  workers?: number;
};

export type CurrentShift = {
  id: number | null;
  date: string | null;
  shift: string | null;
  status: ShiftStatus | null;
  supervisor: string | null;
  startTime: string | null;
  endTime: string | null;
  workers: number;
  production: number;
  operatingHours: number;
  downtime: number;
};

// ============================================================
// BACKEND RESPONSE TYPES
// ============================================================

type BackendProductionRecord = {
  id: number;
  date: string;
  shift: ProductionShift;
  extracted: number | string;
  processed: number | string;
  output: number | string;
  operatingHours: number | string;
  downtime: number | string;
  status: ProductionStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

type BackendProductionSummary = {
  total_extracted: number | string;
  total_processed: number | string;
  total_output: number | string;
  total_operating_hours: number | string;
  total_downtime: number | string;
  processing_efficiency: number | string;
  operating_efficiency: number | string;
  completed_records: number;
  in_progress_records: number;
  delayed_records: number;
};

type BackendChartPoint = {
  day: string;
  date: string;
  extracted: number | string;
  processed: number | string;
  output: number | string;
};

type BackendProductionTarget = {
  id: number;
  date: string;
  target: number | string;
  createdAt: string;
  updatedAt: string;
};

type BackendTargetProgress = {
  target_date: string;
  target_output: number | string;
  actual_output: number | string;
  remaining_output: number | string;
  progress_percentage: number | string;
};

type BackendIssue = {
  id: number;
  title: string;
  description: string | null;
  category: string;
  priority: "High" | "Medium" | "Low";
  duration: string;
  durationMinutes: number | null;
  status: "Active" | "Resolved";
  createdAt: string;
  updatedAt: string;
};

type BackendShift = {
  id: number;
  date: string;
  shift: string;
  status: ShiftStatus;
  supervisor: string;
  startTime: string;
  endTime: string;
  workers: number;
  production: number | string;
  operatingHours: number | string;
  downtime: number | string;
};

type BackendCurrentShift = {
  id: number | null;
  date: string | null;
  shift: string | null;
  status: ShiftStatus | null;
  supervisor: string | null;
  startTime: string | null;
  endTime: string | null;
  workers: number;
  production: number | string;
  operatingHours: number | string;
  downtime: number | string;
};

// ============================================================
// HELPERS
// ============================================================

function numberValue(
  value: number | string | null | undefined,
): number {
  return Number(value ?? 0);
}

function mapProductionRecord(
  record: BackendProductionRecord,
): ProductionRecord {
  return {
    id: record.id,
    date: record.date,
    shift: record.shift,
    extracted: numberValue(record.extracted),
    processed: numberValue(record.processed),
    output: numberValue(record.output),
    operatingHours: numberValue(record.operatingHours),
    downtime: numberValue(record.downtime),
    status: record.status,
    notes: record.notes,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

function mapProductionTarget(
  target: BackendProductionTarget,
): ProductionTarget {
  return {
    id: target.id,
    date: target.date,
    target: numberValue(target.target),
    createdAt: target.createdAt,
    updatedAt: target.updatedAt,
  };
}

function mapIssue(
  issue: BackendIssue,
): OperationalIssue {
  return {
    id: issue.id,
    title: issue.title,
    description: issue.description ?? "",
    category: issue.category,
    priority: issue.priority,
    duration: issue.duration,
    durationMinutes: issue.durationMinutes,
    status: issue.status,
    createdAt: issue.createdAt,
    updatedAt: issue.updatedAt,
  };
}

function mapShift(
  shift: BackendShift,
): MineShift {
  return {
    id: shift.id,
    date: shift.date,
    shift: shift.shift,
    status: shift.status,
    supervisor: shift.supervisor,
    startTime: shift.startTime,
    endTime: shift.endTime,
    workers: shift.workers,
    production: numberValue(shift.production),
    operatingHours: numberValue(
      shift.operatingHours,
    ),
    downtime: numberValue(
      shift.downtime,
    ),
  };
}

// ============================================================
// GENERIC API REQUEST
// ============================================================

async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    },
  );

  if (!response.ok) {
    const errorText =
      await response.text();

    throw new Error(
      `Mine Operations API error ${response.status}: ${errorText}`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType =
    response.headers.get("content-type");

  if (
    !contentType ||
    !contentType.includes(
      "application/json",
    )
  ) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// ============================================================
// PRODUCTION RECORDS
// ============================================================

export async function getProductionRecords(
  options?: {
    shift?: string;
    startDate?: string;
    endDate?: string;
  },
): Promise<ProductionRecord[]> {
  const params =
    new URLSearchParams();

  if (
    options?.shift &&
    options.shift !== "All Shifts"
  ) {
    params.set(
      "shift",
      options.shift,
    );
  }

  if (options?.startDate) {
    params.set(
      "start_date",
      options.startDate,
    );
  }

  if (options?.endDate) {
    params.set(
      "end_date",
      options.endDate,
    );
  }

  const query =
    params.toString();

  const data =
    await apiRequest<
      BackendProductionRecord[]
    >(
      `/api/v1/mine-operations/production${
        query
          ? `?${query}`
          : ""
      }`,
    );

  return data.map(
    mapProductionRecord,
  );
}

export async function createProductionRecord(
  payload: ProductionRecordPayload,
): Promise<ProductionRecord> {
  const data =
    await apiRequest<
      BackendProductionRecord
    >(
      "/api/v1/mine-operations/production",
      {
        method: "POST",
        body: JSON.stringify({
          date: payload.date,
          shift: payload.shift,
          extracted:
            payload.extracted,
          processed:
            payload.processed,
          output: payload.output,
          operatingHours:
            payload.operatingHours,
          downtime:
            payload.downtime,
          status:
            payload.status,
          notes:
            payload.notes ?? null,
        }),
      },
    );

  return mapProductionRecord(
    data,
  );
}

export async function updateProductionRecord(
  id: number,
  payload: Partial<ProductionRecordPayload>,
): Promise<ProductionRecord> {
  if (!id || id <= 0) {
    throw new Error(
      "A valid production record ID is required.",
    );
  }

  const body: Record<
    string,
    unknown
  > = {};

  if (payload.date !== undefined) {
    body.date =
      payload.date;
  }

  if (payload.shift !== undefined) {
    body.shift =
      payload.shift;
  }

  if (
    payload.extracted !==
    undefined
  ) {
    body.extracted =
      payload.extracted;
  }

  if (
    payload.processed !==
    undefined
  ) {
    body.processed =
      payload.processed;
  }

  if (
    payload.output !==
    undefined
  ) {
    body.output =
      payload.output;
  }

  if (
    payload.operatingHours !==
    undefined
  ) {
    body.operatingHours =
      payload.operatingHours;
  }

  if (
    payload.downtime !==
    undefined
  ) {
    body.downtime =
      payload.downtime;
  }

  if (payload.status !== undefined) {
    body.status =
      payload.status;
  }

  if (payload.notes !== undefined) {
    body.notes =
      payload.notes;
  }

  const data =
    await apiRequest<
      BackendProductionRecord
    >(
      `/api/v1/mine-operations/production/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      },
    );

  return mapProductionRecord(
    data,
  );
}

export async function deleteProductionRecord(
  id: number,
): Promise<void> {
  if (!id || id <= 0) {
    throw new Error(
      "A valid production record ID is required.",
    );
  }

  await apiRequest<void>(
    `/api/v1/mine-operations/production/${id}`,
    {
      method: "DELETE",
    },
  );
}

// ============================================================
// PRODUCTION SUMMARY
// ============================================================

export async function getProductionSummary(
  startDate: string,
  endDate: string,
  shift?: string,
): Promise<ProductionSummary> {
  const params =
    new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
    });

  if (
    shift &&
    shift !== "All Shifts"
  ) {
    params.set(
      "shift",
      shift,
    );
  }

  const data =
    await apiRequest<
      BackendProductionSummary
    >(
      `/api/v1/mine-operations/production/summary?${params.toString()}`,
    );

  return {
    totalExtracted:
      numberValue(
        data.total_extracted,
      ),

    totalProcessed:
      numberValue(
        data.total_processed,
      ),

    totalOutput:
      numberValue(
        data.total_output,
      ),

    totalOperatingHours:
      numberValue(
        data.total_operating_hours,
      ),

    totalDowntime:
      numberValue(
        data.total_downtime,
      ),

    processingEfficiency:
      numberValue(
        data.processing_efficiency,
      ),

    operatingEfficiency:
      numberValue(
        data.operating_efficiency,
      ),

    completedRecords:
      data.completed_records,

    inProgressRecords:
      data.in_progress_records,

    delayedRecords:
      data.delayed_records,
  };
}

// ============================================================
// PRODUCTION CHART
// ============================================================

export async function getProductionChart(
  startDate: string,
  endDate: string,
  shift?: string,
): Promise<ProductionChartPoint[]> {
  const params =
    new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
    });

  if (
    shift &&
    shift !== "All Shifts"
  ) {
    params.set(
      "shift",
      shift,
    );
  }

  const data =
    await apiRequest<
      BackendChartPoint[]
    >(
      `/api/v1/mine-operations/production/chart?${params.toString()}`,
    );

  return data.map(
    (point) => ({
      day: point.day,
      date: point.date,
      extracted:
        numberValue(
          point.extracted,
        ),
      processed:
        numberValue(
          point.processed,
        ),
      output:
        numberValue(
          point.output,
        ),
    }),
  );
}

// ============================================================
// DAILY PRODUCTION TARGET
// ============================================================

export async function getProductionTarget(
  targetDate: string,
): Promise<ProductionTarget> {
  const params =
    new URLSearchParams({
      target_date:
        targetDate,
    });

  const data =
    await apiRequest<
      BackendProductionTarget
    >(
      `/api/v1/mine-operations/production/target?${params.toString()}`,
    );

  return mapProductionTarget(
    data,
  );
}

export async function createProductionTarget(
  payload: ProductionTargetPayload,
): Promise<ProductionTarget> {
  if (!payload.target_date) {
    throw new Error(
      "A target date is required.",
    );
  }

  if (
    payload.target_output ===
      undefined ||
    payload.target_output < 0
  ) {
    throw new Error(
      "A valid production target is required.",
    );
  }

  const data =
    await apiRequest<
      BackendProductionTarget
    >(
      "/api/v1/mine-operations/production/target",
      {
        method: "POST",
        body: JSON.stringify({
          target_date:
            payload.target_date,
          target_output:
            payload.target_output,
        }),
      },
    );

  return mapProductionTarget(
    data,
  );
}

export async function updateProductionTarget(
  targetDate: string,
  targetOutput: number,
): Promise<ProductionTarget> {
  if (!targetDate) {
    throw new Error(
      "A target date is required.",
    );
  }

  if (
    targetOutput === undefined ||
    targetOutput < 0
  ) {
    throw new Error(
      "A valid production target is required.",
    );
  }

  const data =
    await apiRequest<
      BackendProductionTarget
    >(
      `/api/v1/mine-operations/production/target?target_date=${encodeURIComponent(
        targetDate,
      )}`,
      {
        method: "PUT",
        body: JSON.stringify({
          target_date:
            targetDate,
          target_output:
            targetOutput,
        }),
      },
    );

  return mapProductionTarget(
    data,
  );
}

export async function getProductionTargetProgress(
  targetDate: string,
): Promise<ProductionTargetProgress> {
  const params =
    new URLSearchParams({
      target_date:
        targetDate,
    });

  const data =
    await apiRequest<
      BackendTargetProgress
    >(
      `/api/v1/mine-operations/production/target/progress?${params.toString()}`,
    );

  return {
    targetDate:
      data.target_date,

    targetOutput:
      numberValue(
        data.target_output,
      ),

    actualOutput:
      numberValue(
        data.actual_output,
      ),

    remainingOutput:
      numberValue(
        data.remaining_output,
      ),

    progressPercentage:
      numberValue(
        data.progress_percentage,
      ),
  };
}

// ============================================================
// OPERATIONAL ISSUES
// ============================================================

export async function getOperationalIssues(
  issueStatus = "Active",
): Promise<OperationalIssue[]> {
  const data =
    await apiRequest<
      BackendIssue[]
    >(
      `/api/v1/mine-operations/issues?status=${encodeURIComponent(
        issueStatus,
      )}`,
    );

  return data.map(mapIssue);
}

export async function createOperationalIssue(
  payload: OperationalIssuePayload,
): Promise<OperationalIssue> {
  const data =
    await apiRequest<
      BackendIssue
    >(
      "/api/v1/mine-operations/issues",
      {
        method: "POST",
        body: JSON.stringify(
          payload,
        ),
      },
    );

  return mapIssue(data);
}

export async function updateOperationalIssue(
  id: number,
  payload: Partial<OperationalIssuePayload>,
): Promise<OperationalIssue> {
  if (!id || id <= 0) {
    throw new Error(
      "A valid operational issue ID is required.",
    );
  }

  const data =
    await apiRequest<
      BackendIssue
    >(
      `/api/v1/mine-operations/issues/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(
          payload,
        ),
      },
    );

  return mapIssue(data);
}

export async function deleteOperationalIssue(
  id: number,
): Promise<void> {
  if (!id || id <= 0) {
    throw new Error(
      "A valid operational issue ID is required.",
    );
  }

  await apiRequest<void>(
    `/api/v1/mine-operations/issues/${id}`,
    {
      method: "DELETE",
    },
  );
}

// ============================================================
// SHIFTS
// ============================================================

export async function getMineShifts(): Promise<MineShift[]> {
  const data =
    await apiRequest<
      BackendShift[]
    >(
      "/api/v1/mine-operations/shifts",
    );

  return data.map(mapShift);
}

export async function createMineShift(
  payload: MineShiftPayload,
): Promise<MineShift> {
  if (!payload.date) {
    throw new Error(
      "A shift date is required.",
    );
  }

  if (!payload.shift) {
    throw new Error(
      "A shift name is required.",
    );
  }

  if (!payload.supervisor) {
    throw new Error(
      "A supervisor is required.",
    );
  }

  if (!payload.startTime) {
    throw new Error(
      "A shift start time is required.",
    );
  }

  if (!payload.endTime) {
    throw new Error(
      "A shift end time is required.",
    );
  }

  if (payload.workers < 0) {
    throw new Error(
      "Workers cannot be negative.",
    );
  }

  const data =
    await apiRequest<
      BackendShift
    >(
      "/api/v1/mine-operations/shifts",
      {
        method: "POST",
        body: JSON.stringify({
          date: payload.date,
          shift: payload.shift,
          status: payload.status,
          supervisor:
            payload.supervisor,
          startTime:
            payload.startTime,
          endTime:
            payload.endTime,
          workers:
            payload.workers,
        }),
      },
    );

  return mapShift(data);
}

export async function updateMineShift(
  id: number,
  payload: MineShiftUpdatePayload,
): Promise<MineShift> {
  if (!id || id <= 0) {
    throw new Error(
      "A valid shift ID is required.",
    );
  }

  const body: Record<
    string,
    unknown
  > = {};

  if (payload.date !== undefined) {
    body.date =
      payload.date;
  }

  if (payload.shift !== undefined) {
    body.shift =
      payload.shift;
  }

  if (payload.status !== undefined) {
    body.status =
      payload.status;
  }

  if (
    payload.supervisor !==
    undefined
  ) {
    body.supervisor =
      payload.supervisor;
  }

  if (
    payload.startTime !==
    undefined
  ) {
    body.startTime =
      payload.startTime;
  }

  if (
    payload.endTime !==
    undefined
  ) {
    body.endTime =
      payload.endTime;
  }

  if (
    payload.workers !==
    undefined
  ) {
    if (payload.workers < 0) {
      throw new Error(
        "Workers cannot be negative.",
      );
    }

    body.workers =
      payload.workers;
  }

  const data =
    await apiRequest<
      BackendShift
    >(
      `/api/v1/mine-operations/shifts/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      },
    );

  return mapShift(data);
}

export async function deleteMineShift(
  id: number,
): Promise<void> {
  if (!id || id <= 0) {
    throw new Error(
      "A valid shift ID is required.",
    );
  }

  await apiRequest<void>(
    `/api/v1/mine-operations/shifts/${id}`,
    {
      method: "DELETE",
    },
  );
}

// ============================================================
// CURRENT SHIFT
// ============================================================

export async function getCurrentShift(
  targetDate: string,
): Promise<CurrentShift> {
  if (!targetDate) {
    throw new Error(
      "A target date is required.",
    );
  }

  const data =
    await apiRequest<
      BackendCurrentShift
    >(
      `/api/v1/mine-operations/shifts/current?target_date=${encodeURIComponent(
        targetDate,
      )}`,
    );

  return {
    id: data.id,

    date: data.date,

    shift: data.shift,

    status: data.status,

    supervisor:
      data.supervisor,

    startTime:
      data.startTime,

    endTime:
      data.endTime,

    workers:
      data.workers,

    production:
      numberValue(
        data.production,
      ),

    operatingHours:
      numberValue(
        data.operatingHours,
      ),

    downtime:
      numberValue(
        data.downtime,
      ),
  };
}